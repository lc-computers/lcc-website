import { NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import { getDb, hasDb, type Db } from "@/lib/db";
import { bookings, bookingHolds, leads } from "@/lib/db/schema";
import { isSlotAvailable, withSlotLock } from "@/lib/booking/availability";
import { travelFeeCents } from "@/lib/booking/travel-fee";
import { findService } from "@/lib/booking/services";
import { site } from "@/lib/site";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { randomToken } from "@/lib/tokens";
import { formatDateTime } from "@/lib/format";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOLD_MINUTES = 15;

const bodySchema = z
  .object({
    serviceSlug: z.string().min(1).max(64),
    start: z.iso.datetime(),
    name: z.string().trim().min(2).max(120),
    email: z.email().max(200),
    phone: z
      .string()
      .trim()
      .min(10)
      .max(30)
      .regex(/^[\d\s()+.-]+$/, "Enter a valid phone number"),
    street: z.string().trim().max(200).optional(),
    city: z.string().trim().max(100).optional(),
    zip: z
      .string()
      .trim()
      .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code")
      .optional(),
    smsConsent: z.boolean().default(false),
  })
  .strict();

const CALL_US = `Online booking hit a snag. Please call us at ${site.phone.display} and we'll get you scheduled.`;

export async function POST(req: Request) {
  const limit = await rateLimit({
    name: "checkout",
    identifier: clientIp(req),
    limit: 12,
    windowSeconds: 3600,
  });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts — please call us instead." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first ? `${first.message}` : "Please check the form and try again." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const service = await findService(input.serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }

  if (service.kind === "in_home" && (!input.street || !input.city || !input.zip)) {
    return NextResponse.json(
      { error: "Street address, city, and ZIP are required for in-home visits." },
      { status: 400 }
    );
  }

  if (!hasDb() || !isStripeConfigured()) {
    return NextResponse.json({ error: CALL_US }, { status: 503 });
  }

  const start = new Date(input.start);
  const fee = travelFeeCents(service, input.city, input.zip);
  const total = service.priceCents + fee;
  const db = getDb();

  // Reserve the slot: capacity check + booking + 15-minute hold, serialized
  // per calendar day via an advisory lock so two checkouts can't both pass.
  let bookingId: string;
  try {
    const reserved = await db.transaction(async (tx) => {
      return withSlotLock(tx, start, async () => {
        const check = await isSlotAvailable(tx as unknown as Db, service, start);
        if (!check.ok || !check.slot) {
          return { error: check.reason ?? "slot_taken" } as const;
        }
        const [booking] = await tx
          .insert(bookings)
          .values({
            serviceSlug: service.slug,
            status: "pending_payment",
            customerName: input.name,
            email: input.email.toLowerCase(),
            phone: input.phone,
            street: service.kind === "in_home" ? input.street : null,
            city: service.kind === "in_home" ? input.city : null,
            zip: service.kind === "in_home" ? input.zip : null,
            smsConsent: input.smsConsent,
            priceCents: service.priceCents,
            travelFeeCents: fee,
            totalCents: total,
            startAt: check.slot.start,
            endAt: check.slot.end,
            blockEndAt: check.slot.blockEnd,
            manageToken: randomToken(24),
          })
          .returning({ id: bookings.id });
        if (!booking) throw new Error("insert returned no row");
        await tx.insert(bookingHolds).values({
          bookingId: booking.id,
          startAt: check.slot.start,
          blockEndAt: check.slot.blockEnd,
          expiresAt: new Date(Date.now() + HOLD_MINUTES * 60_000),
        });
        return { id: booking.id } as const;
      });
    });
    if ("error" in reserved) {
      const message =
        reserved.error === "slot_taken" || reserved.error === "too_soon"
          ? "That time was just taken — please pick another slot."
          : "That time isn't available — please pick another slot.";
      return NextResponse.json({ error: message, code: "slot_unavailable" }, { status: 409 });
    }
    bookingId = reserved.id;
  } catch (err) {
    console.error("checkout: reservation failed", err);
    return NextResponse.json({ error: CALL_US }, { status: 500 });
  }

  // Lead record — contact info is captured before payment (abandoned recovery)
  try {
    await db.insert(leads).values({
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      source: "booking",
      message: `Started checkout: ${service.name} for ${formatDateTime(start)}`,
      meta: { bookingId, service: service.slug },
    });
  } catch (err) {
    console.error("checkout: lead insert failed (continuing)", err);
  }

  // Stripe Checkout session (30 min expiry — Stripe's minimum; our own hold
  // is 15 min and the webhook re-checks capacity before confirming).
  try {
    const stripe = getStripe();
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          unit_amount: service.priceCents,
          product_data: {
            name: service.name,
            description: `${formatDateTime(start)} · ${site.name}`,
          },
        },
        quantity: 1,
      },
    ];
    if (fee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: fee,
          product_data: {
            name: "Travel fee (outside Russell Springs)",
            description: "Flat fee for surrounding-county addresses",
          },
        },
        quantity: 1,
      });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: input.email.toLowerCase(),
      metadata: { bookingId },
      payment_intent_data: { metadata: { bookingId } },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${site.url}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/book?canceled=1&service=${service.slug}`,
    });
    await db
      .update(bookings)
      .set({ stripeSessionId: session.id, updatedAt: new Date() })
      .where(eq(bookings.id, bookingId));
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("checkout: stripe session failed", err);
    // Release the reservation so the slot isn't stuck for 15 minutes.
    try {
      await db.delete(bookingHolds).where(eq(bookingHolds.bookingId, bookingId));
      await db
        .update(bookings)
        .set({ status: "canceled", canceledAt: new Date(), updatedAt: new Date() })
        .where(eq(bookings.id, bookingId));
    } catch {
      // lifecycle cron will clean up
    }
    return NextResponse.json({ error: CALL_US }, { status: 502 });
  }
}
