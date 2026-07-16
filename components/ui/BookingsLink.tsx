"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics/client";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Link to the Microsoft Bookings consult page. Fires bookings_link_clicked.
 * If BOOKINGS_URL is not configured yet, falls back to the contact page so the
 * CTA never dead-ends.
 */
export function BookingsLink({
  bookingsUrl,
  location,
  children,
  variant = "primary",
  className = "",
}: {
  bookingsUrl: string | null;
  location: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "onNavy" | "brass";
  className?: string;
}) {
  const cls = buttonClasses(variant, className);
  if (!bookingsUrl) {
    return (
      <a href="/contact" className={cls} onClick={() => track("bookings_link_clicked", { location, fallback: 1 })}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={bookingsUrl}
      className={cls}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("bookings_link_clicked", { location })}
    >
      {children}
    </a>
  );
}
