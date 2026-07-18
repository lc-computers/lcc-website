import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { BookingsLink } from "@/components/ui/BookingsLink";
import { JsonLd } from "@/components/JsonLd";
import { serviceJsonLd } from "@/lib/jsonld";
import { servicePages, getServicePage } from "@/lib/content/services";
import { businessServices } from "@/lib/site";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: { title: page.metaTitle, description: page.metaDescription },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const related = businessServices.filter((s) => s.slug !== page.slug).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950">
        <HeroBackdrop src="/photos/hero-circuit.webp" priority />
        <Container className="py-14 sm:py-20">
          <p className="eyebrow-light">{page.heroKicker}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
            {page.heroTitle}
          </h1>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="space-y-5 text-lg text-ink-700">
                {page.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <h2 className="mt-12 font-serif text-2xl font-semibold text-ink-900">
                {page.whatsIncludedTitle}
              </h2>
              <ul className="mt-6 space-y-3.5">
                {page.whatsIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-1 h-4.5 w-4.5 shrink-0 text-brass-600" aria-hidden="true" />
                    <span className="text-base text-ink-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 space-y-5 text-base text-ink-700">
                {page.closing.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <aside className="lg:pt-2">
              <div className="rounded-lg border border-cream-200 bg-white p-6 shadow-card">
                <h2 className="font-serif text-lg font-semibold text-ink-900">{page.whoForTitle}</h2>
                <ul className="mt-4 space-y-3">
                  {page.whoFor.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-cream-200 pt-6">
                  <BookingsLink
                    bookingsUrl={process.env.BOOKINGS_URL ?? null}
                    location={`service_${page.slug}`}
                    className="w-full"
                  >
                    Book a free consultation
                  </BookingsLink>
                  <p className="mt-3 text-center text-xs text-ink-500">
                    No obligation. Written quote before any work.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-cream-200 bg-cream-100 p-6">
                <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-ink-900">
                  Related services
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {related.map((s) => (
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
            </aside>
          </div>
        </Container>
      </section>

      <FaqSection items={page.faq} title={`${page.name} — common questions`} />

      <CtaBand
        title="Let's look at your setup."
        lede="A free consultation costs you thirty minutes and nothing else. We'll tell you what's solid, what's fragile, and exactly what fixing it would cost — in writing."
        cta={
          <BookingsLink
            bookingsUrl={process.env.BOOKINGS_URL ?? null}
            location={`service_${page.slug}_cta`}
            variant="onNavy"
          >
            Book a free consultation
          </BookingsLink>
        }
        location={`service_${page.slug}_band`}
      />

      <JsonLd
        data={serviceJsonLd({
          name: page.name,
          description: page.metaDescription,
          slug: page.slug,
        })}
      />
    </>
  );
}
