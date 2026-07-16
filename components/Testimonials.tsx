import { TESTIMONIALS } from "@/lib/site-data";

export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          What our customers say
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.quote}
              className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
            >
              <blockquote className="text-slate-700 dark:text-slate-300">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">{t.name}</span>
                <span className="text-slate-500 dark:text-slate-400"> — {t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
