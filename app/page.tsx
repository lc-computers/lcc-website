import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import Testimonials from "@/components/Testimonials";
import { BUSINESS, CITIES, SERVICES } from "@/lib/site-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const TRUST_POINTS = [
  {
    heading: "Actually local",
    text: "Based in Russell Springs and on-site across the Lake Cumberland region — not a call center three states away.",
  },
  {
    heading: "Straight answers",
    text: "Plain-English advice and honest recommendations. If something isn't worth fixing, we'll tell you.",
  },
  {
    heading: "Business & residential",
    text: "From managed IT for companies to fixing the family laptop — one local team for all of it.",
  },
  {
    heading: "One number to call",
    text: "Computers, network, WiFi, cameras, phones — when technology breaks, you call us and it gets handled.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Russell Springs, KY — serving the Lake Cumberland region
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            IT services and computer support for the Lake Cumberland region
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Managed IT, networking, cybersecurity, WiFi, security cameras, business phones, and
            computer repair — for businesses and homes in Somerset, Russell Springs, and
            surrounding south-central Kentucky.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={BUSINESS.phoneHref}
              className="rounded-md bg-sky-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-sky-700"
            >
              Call {BUSINESS.phone}
            </a>
            <Link
              href="/services"
              className="rounded-md border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          What we do
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Everything a local business or household needs to keep technology working.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group rounded-lg border border-slate-200 p-6 transition-colors hover:border-sky-400 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-600 dark:hover:bg-slate-900"
            >
              <h3 className="font-semibold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{s.blurb}</p>
              <p className="mt-3 text-sm font-medium text-sky-600 dark:text-sky-400">
                Learn more →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Why Lake Cumberland Computers
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((point) => (
              <div key={point.heading}>
                <h3 className="font-semibold text-slate-900 dark:text-white">{point.heading}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Serving south-central Kentucky
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          On-site service across the Lake Cumberland region, from our home base in Russell
          Springs:
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {CITIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/service-areas/${c.slug}`}
                className="inline-block rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-sky-400 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-sky-600 dark:hover:text-sky-400"
              >
                {c.name}, KY
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Cta />
    </>
  );
}
