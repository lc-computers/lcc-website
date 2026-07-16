import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { CITIES, getService, SERVICES, SITE_URL } from "@/lib/site-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.metaDescription,
      url: `${SITE_URL}/services/${service.slug}`,
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: CITIES.map((c) => ({ "@type": "City", name: `${c.name}, KY` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        {
          "@type": "ListItem",
          position: 3,
          name: service.title,
          item: `${SITE_URL}/services/${service.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={schema} />
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
              <Link href="/services" className="hover:text-sky-600 dark:hover:text-sky-400">
                Services
              </Link>
              <span aria-hidden="true"> / </span>
            </li>
            <li aria-current="page" className="text-slate-700 dark:text-slate-200">
              {service.title}
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {service.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          {service.intro}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {service.bullets.map((b) => (
            <div
              key={b.heading}
              className="rounded-lg border border-slate-200 p-6 dark:border-slate-800"
            >
              <h2 className="font-semibold text-slate-900 dark:text-white">{b.heading}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{b.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          {service.closing}
        </p>

        <section className="mt-12 rounded-lg bg-slate-50 p-6 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {service.name} across the Lake Cumberland region
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            We provide {service.name.toLowerCase()} service throughout south-central Kentucky:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/service-areas/${c.slug}`}
                  className="inline-block rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-600 transition-colors hover:border-sky-400 hover:text-sky-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
      <Cta heading={`Need ${service.name.toLowerCase()} help?`} />
    </>
  );
}
