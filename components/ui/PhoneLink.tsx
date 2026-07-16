"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics/client";
import { site } from "@/lib/site";

/** tel: link that fires the phone_clicked conversion event. */
export function PhoneLink({
  className = "",
  children,
  location,
}: {
  className?: string;
  children?: ReactNode;
  location: string;
}) {
  return (
    <a
      href={site.phone.tel}
      className={className}
      onClick={() => track("phone_clicked", { location })}
    >
      {children ?? site.phone.display}
    </a>
  );
}
