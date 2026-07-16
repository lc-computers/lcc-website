import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import { SERVICES } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "IT Services",
  description:
    "Managed IT, networking, cybersecurity, WiFi, security cameras, phone systems, and computer repair for businesses and homes in the Lake Cumberland region of Kentucky.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Our Services
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          One local team for everything your business or home depends on — from managed IT and
          networking to cameras, phones, and computer repair. Serving the Lake Cumberland region
          of south-central Kentucky.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group rounded-lg border border-slate-200 p-6 transition-colors hover:border-sky-400 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-600 dark:hover:bg-slate-900"
            >
              <h2 className="text-xl font-semibold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                {s.title}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{s.blurb}</p>
              <p className="mt-4 text-sm font-medium text-sky-600 dark:text-sky-400">
                Learn more →
              </p>
            </Link>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
