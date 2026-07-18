import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, hasDb } from "@/lib/db";
import { getAvailability } from "@/lib/booking/availability";
import { findService } from "@/lib/booking/services";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  service: z.string().min(1).max(64),
  excludeBooking: z.string().uuid().optional(),
});

export async function GET(req: Request) {
  const limit = await rateLimit({
    name: "availability",
    identifier: clientIp(req),
    limit: 120,
    windowSeconds: 3600,
  });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    service: url.searchParams.get("service") ?? "",
    excludeBooking: url.searchParams.get("excludeBooking") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const service = await findService(parsed.data.service);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 404 });
  }

  if (!hasDb()) {
    return NextResponse.json(
      { error: "Online booking is temporarily unavailable. Please call us.", days: [] },
      { status: 503 }
    );
  }

  try {
    const days = await getAvailability(getDb(), service, {
      excludeBookingId: parsed.data.excludeBooking,
    });
    return NextResponse.json({ days });
  } catch (err) {
    console.error("availability: failed", err);
    return NextResponse.json(
      { error: "Online booking is temporarily unavailable. Please call us.", days: [] },
      { status: 503 }
    );
  }
}
