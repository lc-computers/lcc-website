import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Car, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { BookingsLink } from "@/components/ui/BookingsLink";
import { CtaBand } from "@/components/sections/CtaBand";
import { areaPages, getAreaPage } from "@/lib/content/areas";
import { businessServices, site } from "@/lib/site";
import { getServiceMenu } from "@/lib/booking/services";

// Hourly refresh so limited-time promos appear/expire on schedule without an
// admin edit (admin saves still revalidate immediately).
export const revalidate = 3600;

export function generateStaticParams() {
  return areaPages.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaPage(slug);
  if (!area) return {};
  return {
    title: area.metaTitle,
    description: area.metaDescription,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: { title: area.metaTitle, description: area.metaDescription },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = getAreaPage(slug);
  if (!area) notFound();

  const otherAreas = areaPages.filter((a) => a.slug !== area.slug);
  const menuHighlights = (await getServiceMenu()).slice(0, 5);

  return (
    <>
      <section className="border-b border-cream-200 bg-cream-100">
        <Container className="py-14 sm:py-20">
          <p className="eyebrow">
            <MapPin className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
            {area.town}, Kentucky — {area.county} County
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">
            {area.heroTitle}
          </h1>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-5 text-base text-ink-700 sm:text-lg">
              {area.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <ButtonLink href="/book">Book a home visit in {area.town}</ButtonLink>
                <BookingsLink
                  bookingsUrl={process.env.BOOKINGS_URL ?? null}
                  location={`area_${area.slug}`}
                  variant="secondary"
                >
                  Free business consultation
                </BookingsLink>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-lg border border-cream-200 bg-white p-6 shadow-card">
                <h2 className="font-serif text-lg font-semibold text-ink-900">
                  Flat-rate home services in {area.town}
                </h2>
                <ul className="mt-4 divide-y divide-cream-100">
                  {menuHighlights.map((s) => (
                    <li key={s.slug} className="flex items-baseline justify-between gap-3 py-2.5">
                      <Link
                        href={`/book?service=${s.slug}`}
                        className="text-sm font-medium text-navy-700 hover:text-navy-900"
                      >
                        {s.name}
                      </Link>
                      <span className="font-serif text-base font-semibold text-ink-900">
                        {s.priceDisplay}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex items-start gap-2 text-xs text-ink-500">
                  <Car className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {area.travelNote}
                </p>
              </div>

              <div className="rounded-lg border border-cream-200 bg-cream-100 p-6">
                <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink-900">
                  For {area.town} offices
                </h2>
                <ul className="mt-3 space-y-2">
                  {businessServices.slice(0, 4).map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900"
                      >
                        {s.name}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-cream-200 bg-cream-100 p-6">
                <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink-900">
                  Nearby towns we serve
                </h2>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {otherAreas.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/areas/${a.slug}`}
                        className="text-sm font-medium text-navy-700 underline decoration-navy-200 underline-offset-4 hover:text-navy-900"
                      >
                        {a.town}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <CtaBand
        title={`Need a hand in ${area.town}?`}
        lede={`Book online in two minutes, or call the shop — ${site.phone.display}, ${site.hours.short}. Local techs, posted prices, confirmed times.`}
        location={`area_${area.slug}_cta`}
      />
    </>
  );
}
