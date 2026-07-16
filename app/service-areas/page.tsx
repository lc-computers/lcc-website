import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import { CITIES } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "Lake Cumberland Computers provides on-site IT services, networking, and computer repair across south-central Kentucky: Somerset, Russell Springs, Jamestown, Liberty, Columbia, Albany, Greensburg, Burkesville, and Monticello.",
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreasPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Service Areas
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          From our home base in Russell Springs, we provide on-site IT service across the Lake
          Cumberland region of south-central Kentucky — the towns around the lake and the counties
          that surround it. Remote support covers you between visits, and when hands-on work is
          needed, we drive to you.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/service-areas/${c.slug}`}
              className="group rounded-lg border border-slate-200 p-6 transition-colors hover:border-sky-400 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-600 dark:hover:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                {c.name}, KY
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{c.county}</p>
              <p className="mt-3 text-sm font-medium text-sky-600 dark:text-sky-400">
                IT support in {c.name} →
              </p>
            </Link>
          ))}
        </div>
      </section>
      <Cta heading="Don't see your town?" text="We cover the whole Lake Cumberland region — call and ask." />
    </>
  );
}
