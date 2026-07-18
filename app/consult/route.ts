import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { trackServer } from "@/lib/analytics/server";

/**
 * Short, shareable consultation link: /consult → the Microsoft Bookings page.
 * Keeps chat messages and printed material free of the long Bookings URL, and
 * records the click. Falls back to /contact when BOOKINGS_URL is unset.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  await trackServer("bookings_link_clicked", { location: "consult_redirect" });
  return NextResponse.redirect(process.env.BOOKINGS_URL || `${site.url}/contact`, 307);
}
