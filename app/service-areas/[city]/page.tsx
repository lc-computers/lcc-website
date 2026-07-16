import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { BUSINESS, CITIES, getCity, SERVICES, SITE_URL } from "@/lib/site-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return {
    title: `IT Support & Computer Services in ${city.name}, KY`,
    description: city.metaDescription,
    alternates: { canonical: `/service-areas/${city.slug}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Service Areas",
        item: `${SITE_URL}/service-areas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${city.name}, KY`,
        item: `${SITE_URL}/service-areas/${city.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <article className="mx-auto max-w-6xl px-4 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400">
                Home
              </Link>
              <span aria-hidden="true"> / </span>
            </li>
            <li>
              <Link href="/service-areas" className="hover:text-sky-600 dark:hover:text-sky-400">
                Service Areas
              </Link>
              <span aria-hidden="true"> / </span>
            </li>
            <li aria-current="page" className="text-slate-700 dark:text-slate-200">
              {city.name}, KY
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          IT Support & Computer Services in {city.name}, KY
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          {city.county} · Lake Cumberland region
        </p>

        <p className="mt-6 max-w-3xl text-lg text-slate-600 dark:text-slate-300">{city.intro}</p>
        <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">{city.detail}</p>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Services available in {city.name}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group rounded-lg border border-slate-200 p-4 transition-colors hover:border-sky-400 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-600 dark:hover:bg-slate-900"
              >
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                  {s.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-lg bg-slate-50 p-6 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Local service, based in Russell Springs
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            {BUSINESS.name} is located at {BUSINESS.street}, {BUSINESS.city}, {BUSINESS.state}{" "}
            {BUSINESS.zip}. Call{" "}
            <a
              href={BUSINESS.phoneHref}
              className="font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              {BUSINESS.phone}
            </a>{" "}
            for service in {city.name} — {BUSINESS.hours}.
          </p>
        </section>
      </article>
      <Cta heading={`Need IT help in ${city.name}?`} />
    </>
  );
}
