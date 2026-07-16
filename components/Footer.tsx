import Link from "next/link";
import { BUSINESS, CITIES, FULL_ADDRESS, SERVICES } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {BUSINESS.name}
          </p>
          <address className="mt-3 space-y-1 text-sm not-italic text-slate-600 dark:text-slate-300">
            <p>{FULL_ADDRESS}</p>
            <p>
              <a href={BUSINESS.phoneHref} className="hover:text-sky-600 dark:hover:text-sky-400">
                {BUSINESS.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-sky-600 dark:hover:text-sky-400">
                {BUSINESS.email}
              </a>
            </p>
          </address>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Hours: {BUSINESS.hours}
          </p>
        </div>

        <nav aria-label="Services">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
            Services
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Service areas">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
            Service Areas
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/service-areas/${c.slug}`}
                  className="text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                >
                  IT Support in {c.name}, KY
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
            Company
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400">
                All Services
              </Link>
            </li>
            <li>
              <Link href="/service-areas" className="text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400">
                All Service Areas
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-200 py-4 dark:border-slate-800">
        <p className="mx-auto max-w-6xl px-4 text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} {BUSINESS.name}. Serving the Lake Cumberland region of
          south-central Kentucky.
        </p>
      </div>
    </footer>
  );
}
