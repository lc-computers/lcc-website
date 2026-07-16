import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd, type FaqItem } from "@/lib/jsonld";

/**
 * FAQ rendered with native <details> — keyboard accessible with zero JS —
 * plus FAQPage structured data.
 */
export function FaqSection({
  items,
  title = "Common questions",
  eyebrow = "FAQ",
}: {
  items: FaqItem[];
  title?: string;
  eyebrow?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-8 max-w-3xl divide-y divide-cream-200 border-y border-cream-200">
          {items.map((item) => (
            <details key={item.question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-sans text-base font-semibold text-ink-900 marker:content-none hover:text-navy-700 [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="text-xl font-light text-brass-600 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 pr-8 text-base text-ink-700">{item.answer}</p>
            </details>
          ))}
        </div>
        <JsonLd data={faqJsonLd(items)} />
      </Container>
    </section>
  );
}
