"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { navLinks, mobileOnlyLinks } from "./nav";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-md text-navy-800 hover:bg-cream-100"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
      </button>
      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="absolute inset-x-0 top-full border-b border-cream-200 bg-cream-50 shadow-card"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <ul className="flex flex-col">
              {[...navLinks, ...mobileOnlyLinks].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block border-b border-cream-100 py-3 font-sans text-base font-medium text-ink-900 hover:text-navy-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3 pb-2">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-md bg-navy-700 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-navy-800"
              >
                Book home service online
              </Link>
              <PhoneLink
                location="mobile_menu"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-navy-300 px-6 py-3 text-sm font-semibold text-navy-800"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {site.phone.display}
              </PhoneLink>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
