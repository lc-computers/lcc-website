import { site, businessServices } from "./site";

/**
 * JSON-LD builders. Facts come from lib/site.ts only — exact NAP everywhere.
 */

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    legalName: site.legalEntity,
    url: site.url,
    telephone: site.phone.e164,
    email: site.email,
    foundingDate: String(site.foundedYear),
    description:
      "Managed IT support, cybersecurity, Microsoft 365, networking, business phones, security cameras, and flat-rate in-home tech help for south-central Kentucky.",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    areaServed: [
      ...site.serviceArea.towns.map((town) => ({
        "@type": "City",
        name: `${town}, KY`,
      })),
      ...site.serviceArea.counties.map((county) => ({
        "@type": "AdministrativeArea",
        name: `${county} County, KY`,
      })),
    ],
    knowsAbout: businessServices.map((s) => s.name),
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  slug: string;
  /** Full path override, e.g. "/home-services" (defaults to /services/<slug>). */
  path?: string;
  offers?: { price: number; name: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${site.url}${opts.path ?? `/services/${opts.slug}`}`,
    provider: { "@id": `${site.url}/#business` },
    areaServed: site.serviceArea.towns.map((town) => ({
      "@type": "City",
      name: `${town}, KY`,
    })),
    ...(opts.offers
      ? {
          offers: opts.offers.map((o) => ({
            "@type": "Offer",
            name: o.name,
            price: o.price.toFixed(2),
            priceCurrency: "USD",
          })),
        }
      : {}),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date;
  updatedAt?: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: `${site.url}/blog/${opts.slug}`,
    datePublished: opts.publishedAt.toISOString(),
    dateModified: (opts.updatedAt ?? opts.publishedAt).toISOString(),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": `${site.url}/#business` },
    mainEntityOfPage: `${site.url}/blog/${opts.slug}`,
  };
}
