import Link from "next/link";
import { BUSINESS } from "@/lib/site-data";

export default function Cta({
  heading = "Ready to get your technology handled?",
  text = "Call us or send a message — we'll give you straight answers and a fair quote.",
}: {
  heading?: string;
  text?: string;
}) {
  return (
    <section className="bg-sky-600 dark:bg-sky-700">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="text-2xl font-bold text-white">{heading}</h2>
          <p className="mt-2 text-sky-100">{text}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a
            href={BUSINESS.phoneHref}
            className="rounded-md bg-white px-6 py-3 text-center font-semibold text-sky-700 transition-colors hover:bg-sky-50"
          >
            Call {BUSINESS.phone}
          </a>
          <Link
            href="/contact"
            className="rounded-md border border-sky-300 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-sky-500"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
