import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoSlot } from "@/components/sections/PhotoSlot";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { CtaBand } from "@/components/sections/CtaBand";
import { TrustBar } from "@/components/sections/TrustBar";
import { site, yearsInBusiness } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us — Local IT Since 2001",
  description:
    "Lake Cumberland Computers is Louis Stargel and a small team of technicians in Russell Springs, KY — serving south-central Kentucky's offices and homes since 2001.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Say it plain",
    text: "Technology has enough jargon. We explain what's wrong, what it costs, and what we'd do in your shoes — in words you'd use at your own kitchen table.",
  },
  {
    title: "Fix the problem, not the invoice",
    text: "If the honest answer is a $30 part or \"don't spend money on this,\" that's the answer you get. We've stayed in business 25 years by being worth calling back.",
  },
  {
    title: "Protect it like it's ours",
    text: "Deeds, dockets, patient charts, family photos — we handle other people's important things all day. That's a responsibility before it's a business.",
  },
  {
    title: "Be there next year",
    text: "The region doesn't need another vendor that vanishes after the install. We support what we build, and we've been reachable at the same phone number for a very long time.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950">
        <HeroBackdrop src="/photos/hero-lake.webp" priority variant="light" />
        <Container className="py-14 sm:py-20">
          <p className="eyebrow-light">About us</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
            A computer shop that grew up with its county.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            {site.name} has worked from Russell Springs since {site.foundedYear} — through
            dial-up, Windows XP, the cloud, and everything currently trying to phish your
            front office.
          </p>
        </Container>
      </section>

      <TrustBar />

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-5 text-base text-ink-700 sm:text-lg">
              <p>
                In {site.foundedYear}, Louis Stargel began repairing computers for families and
                businesses in Russell County. Technology was simpler then — most calls were
                failed hard drives, dial-up trouble, or the occasional virus with a strange
                name.
              </p>
              <p>
                The promise was simple too:{" "}
                <strong className="text-ink-900">
                  do good work, charge a fair price, and be here tomorrow.
                </strong>
              </p>
              <p>
                {/* Explicit space: SWC drops the plain leading space after the
                    expression in this text node (same quirk as line 65). */}
                {yearsInBusiness()}
                {" years later the technology is unrecognizable. The promise hasn't moved an inch."}
              </p>
              <p>
                What started as one person making house calls is now Louis and a small team of
                technicians, supporting the offices that keep this region running — county and
                city government, medical practices, professional offices, and small businesses
                across six counties.
              </p>
              <p>
                We never stopped doing house calls. We just made them easier: flat rates
                published online, appointment times you pick yourself, secure online payment,
                and a confirmation in your inbox. Your home computer gets the same technicians
                the courthouse gets.
              </p>
              <p>
                The shop is at {site.address.full}. The phone number is {site.phone.display}.
                Both have been true long enough that half our clients don&apos;t need to look
                them up.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PhotoSlot label="Louis Stargel, owner" aspect="aspect-[3/4]" />
              <div className="mt-10 grid gap-4">
                <PhotoSlot label="Our technicians at work" aspect="aspect-[4/3]" />
                <PhotoSlot label="The shop, Lakeway Dr" aspect="aspect-[4/3]" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-cream-200 bg-cream-100 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="What we run on" title="Four things we won't bend" />
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="border-l-2 border-brass-400 pl-5">
                <h3 className="font-serif text-xl font-semibold text-ink-900">{v.title}</h3>
                <p className="mt-2 text-base text-ink-700">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Come see if we're your kind of people."
        lede="Call the shop, book a home visit, or set up a free consultation for your office. Worst case, you get a straight answer and a cup of coffee."
        location="about_cta"
      />
    </>
  );
}
