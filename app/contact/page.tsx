import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, CITIES, FULL_ADDRESS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact Lake Cumberland Computers in Russell Springs, KY. Call ${BUSINESS.phone}, email, or visit us at ${FULL_ADDRESS}. ${BUSINESS.hours}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        Contact Us
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        Call, email, or stop by — we’re happy to talk through your problem and give you a
        straight answer on what it’ll take to fix it.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Phone</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            The fastest way to reach us:
          </p>
          <a
            href={BUSINESS.phoneHref}
            className="mt-3 inline-block rounded-md bg-sky-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-sky-700"
          >
            {BUSINESS.phone}
          </a>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{BUSINESS.hours}</p>
        </div>

        <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Email</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Send us the details and we’ll get back to you:
          </p>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="mt-3 inline-block break-all font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            {BUSINESS.email}
          </a>
        </div>

        <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Visit</h2>
          <address className="mt-2 not-italic text-slate-600 dark:text-slate-300">
            {BUSINESS.name}
            <br />
            {BUSINESS.street}
            <br />
            {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
          </address>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${BUSINESS.name} ${FULL_ADDRESS}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            Get directions →
          </a>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          On-site service across the region
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          We come to you throughout the Lake Cumberland area:
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/service-areas/${c.slug}`}
                className="inline-block rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-600 transition-colors hover:border-sky-400 hover:text-sky-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
              >
                {c.name}, KY
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
