import Link from "next/link";
import { Phone } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { MobileNav } from "./MobileNav";
import { navLinks } from "./nav";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        {/* Name comes from the visible wordmark text — an aria-label here
            would mismatch the computed visible text (axe label-content-name). */}
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm font-medium text-ink-700 transition-colors hover:text-navy-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <PhoneLink
            location="header"
            className="inline-flex items-center gap-2 font-sans text-sm font-bold text-navy-800 hover:text-navy-600"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span>{site.phone.display}</span>
          </PhoneLink>
          <Link
            href="/book"
            className="hidden rounded-md bg-navy-700 px-4 py-2.5 font-sans text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800 md:inline-flex"
          >
            Book online
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
