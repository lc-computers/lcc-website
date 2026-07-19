import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { trackServer } from "@/lib/analytics/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  event: z.string().min(1).max(64),
  props: z.record(z.string().max(64), z.union([z.string().max(200), z.number()])).optional(),
});

const ALLOWED = new Set([
  "health_check_completed",
  "chat_lead_captured",
  "booking_paid",
  "bookings_link_clicked",
  "phone_clicked",
  "chat_opened",
  "book_step_completed",
  "post_shared",
]);

export async function POST(req: Request) {
  const limit = await rateLimit({
    name: "events",
    identifier: clientIp(req),
    limit: 120,
    windowSeconds: 3600,
  });
  if (!limit.ok) return NextResponse.json({ ok: false }, { status: 429 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success || !ALLOWED.has(parsed.data.event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await trackServer(parsed.data.event, parsed.data.props);
  return NextResponse.json({ ok: true });
}
