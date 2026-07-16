import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { site } from "@/lib/site";
import type { ReactNode } from "react";

/** Full-width navy call-to-action band used at the bottom of most pages. */
export function CtaBand({
  title,
  lede,
  cta,
  location,
}: {
  title: string;
  lede: string;
  /** Primary CTA — defaults to the residential booking flow. */
  cta?: ReactNode;
  location: string;
}) {
  return (
    <section className="bg-navy-900">
      <Container className="py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-navy-100">{lede}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {cta ?? (
              <ButtonLink href="/book" variant="onNavy">
                Book an appointment online
              </ButtonLink>
            )}
            <PhoneLink
              location={location}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-navy-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:border-navy-400 hover:bg-navy-800"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Or call {site.phone.display}
            </PhoneLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
