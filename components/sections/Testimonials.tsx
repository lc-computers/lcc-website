import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/*
 * TODO(Louis): real, named client testimonials go here.
 * Quotes are being collected from long-standing clients (with written
 * permission to use name + organization). Until they arrive, the slots state
 * plainly that quotes are being gathered — nothing is fabricated, ever.
 *
 * To publish a real quote, replace a slot object below:
 *   { quote: "…", name: "Jane Doe", role: "County Clerk, Example County" }
 */
interface TestimonialSlot {
  quote: string | null;
  name: string | null;
  role: string | null;
}

const slots: TestimonialSlot[] = [
  { quote: null, name: null, role: null }, // TODO: government/office client quote
  { quote: null, name: null, role: null }, // TODO: small business or medical practice quote
  { quote: null, name: null, role: null }, // TODO: residential customer quote
];

const placeholderNotes = [
  "Reserved for a word from one of the county and city offices we support.",
  "Reserved for a word from a local business or medical practice we work with.",
  "Reserved for a word from a homeowner we've helped.",
];

export function Testimonials() {
  return (
    <section className="border-y border-cream-200 bg-cream-100 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="In their words"
          title="What the people we work for say"
          lede="We're collecting quotes from the offices and households we've served — real names, real organizations, with their permission. They'll appear here as they come in."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {slots.map((slot, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-lg border border-cream-200 bg-cream-50 p-6"
            >
              <Quote className="h-6 w-6 text-brass-400" aria-hidden="true" />
              {slot.quote ? (
                <>
                  <blockquote className="mt-4 flex-1 text-base text-ink-700">
                    “{slot.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-ink-900">
                    {slot.name}
                    <span className="block font-normal text-ink-500">{slot.role}</span>
                  </figcaption>
                </>
              ) : (
                <p className="mt-4 flex-1 text-sm italic text-ink-500">{placeholderNotes[i]}</p>
              )}
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
