"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BUSINESS } from "@/lib/site-data";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <svg
            className="h-8 w-8 text-sky-600 dark:text-sky-400"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="4" y="6" width="24" height="15" rx="2" />
            <path d="M11 26h10M16 21v5" />
            <path d="M9 15c2-2.5 4-2.5 6 0s4 2.5 6 0" strokeLinecap="round" />
          </svg>
          <span className="text-lg tracking-tight text-slate-900 dark:text-white">
            Lake Cumberland <span className="text-sky-600 dark:text-sky-400">Computers</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-sky-700 dark:text-sky-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={BUSINESS.phoneHref}
            className="ml-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
          >
            {BUSINESS.phone}
          </a>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-slate-200 px-4 pb-4 pt-2 md:hidden dark:border-slate-800"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive(item.href)
                  ? "text-sky-700 dark:text-sky-400"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={BUSINESS.phoneHref}
            className="mt-2 block rounded-md bg-sky-600 px-3 py-2 text-center text-base font-semibold text-white"
          >
            Call {BUSINESS.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
