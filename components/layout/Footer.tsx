import Link from "next/link";
import { MapPin, Clock, Mail } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { site, businessServices } from "@/lib/site";

const companyLinks = [
  { href: "/government", label: "For Government" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/health-check", label: "Free M365 Health Check" },
  { href: "/contact", label: "Contact" },
];

const residentialLinks = [
  { href: "/home-services", label: "Home Services & Prices" },
  { href: "/book", label: "Book an Appointment" },
  { href: "/areas/russell-springs", label: "Service Area" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
              Local IT support for government offices, businesses, and homes across
              south-central Kentucky — since {site.foundedYear}.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass-300" aria-hidden="true" />
                <span>{site.address.full}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brass-300" aria-hidden="true" />
                <span>{site.hours.display}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brass-300" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:text-cream-50">
                  {site.email}
                </a>
              </li>
            </ul>
            <PhoneLink
              location="footer"
              className="mt-5 inline-block font-serif text-xl font-semibold text-cream-50 hover:text-brass-300"
            />
          </div>

          <nav aria-label="Business services">
            <h2 className="eyebrow-light">Business Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {businessServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-cream-50">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="eyebrow-light">Company</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-cream-50">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="For your home">
            <h2 className="eyebrow-light">For Your Home</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {residentialLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-cream-50">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-navy-800 pt-6 text-xs text-navy-300">
          <p>
            Serving {site.serviceArea.towns.join(", ")}, and surrounding counties in
            south-central Kentucky.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {site.legalEntity}. {site.legalLine}. W-9 available on
            request.
          </p>
        </div>
      </div>
    </footer>
  );
}
