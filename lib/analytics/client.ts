"use client";

import { track as vercelTrack } from "@vercel/analytics";

export type ConversionEvent =
  | "health_check_completed"
  | "chat_lead_captured"
  | "booking_paid"
  | "bookings_link_clicked"
  | "phone_clicked"
  | "post_shared";

/**
 * Fire a conversion event to Vercel Analytics and our own events table.
 * Never throws — analytics must never break the page.
 */
export function track(
  event: ConversionEvent | (string & {}),
  props?: Record<string, string | number>
): void {
  try {
    vercelTrack(event, props);
  } catch {
    // analytics blocked — fine
  }
  try {
    const payload = JSON.stringify({ event, props: props ?? {} });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    // never break the page for analytics
  }
}
