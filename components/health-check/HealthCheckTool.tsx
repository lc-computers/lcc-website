"use client";

import { useState, type FormEvent } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { track } from "@/lib/analytics/client";
import { site } from "@/lib/site";

interface CategoryResult {
  key: string;
  title: string;
  grade: string;
  finding: string;
}

interface CheckResult {
  domain: string;
  overall: string;
  freeMailProvider: boolean;
  categories: CategoryResult[];
  intro: string;
  summary: string;
}

const inputCls =
  "w-full rounded-md border border-cream-300 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-500/50 focus:border-navy-500";

const gradeStyles: Record<string, string> = {
  A: "bg-[#E8F2E8] text-[#2D5A2D]",
  B: "bg-navy-50 text-navy-700",
  C: "bg-[#FBF3DF] text-brass-600",
  D: "bg-[#FAECE0] text-[#9A5B23]",
  F: "bg-[#F9E7E4] text-[#A03426]",
};

function GradeChip({ grade, large = false }: { grade: string; large?: boolean }) {
  return (
    <span
      aria-label={`Grade ${grade}`}
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-serif font-bold ${
        gradeStyles[grade] ?? "bg-cream-100 text-ink-700"
      } ${large ? "h-16 w-16 text-3xl" : "h-10 w-10 text-lg"}`}
    >
      {grade}
    </span>
  );
}

export function HealthCheckTool({ bookingsUrl }: { bookingsUrl: string | null }) {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [email, setEmail] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company_website")) return; // honeypot
    setStatus("running");
    setError("");
    try {
      const res = await fetch("/api/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainOrEmail: data.get("domainOrEmail"),
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone") || undefined,
        }),
      });
      const body = (await res.json()) as CheckResult & { error?: string };
      if (!res.ok) {
        throw new Error(body.error ?? "Something went wrong running the check.");
      }
      setEmail(String(data.get("email") ?? ""));
      setResult(body);
      setStatus("done");
      track("health_check_completed", { overall: body.overall });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong running the check.");
    }
  }

  if (status === "done" && result) {
    return (
      <div aria-live="polite">
        <div className="rounded-lg border border-cream-200 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <GradeChip grade={result.overall} large />
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900">
                {result.domain} — overall grade {result.overall}
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Full plain-English report is on its way to <strong>{email}</strong>.
              </p>
            </div>
          </div>
          <p className="mt-5 text-base text-ink-700">{result.intro}</p>
          <ul className="mt-6 divide-y divide-cream-100">
            {result.categories.map((c) => (
              <li key={c.key} className="flex items-start gap-4 py-4">
                <GradeChip grade={c.grade} />
                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-ink-900">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-700">{c.finding}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base text-ink-700">{result.summary}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={bookingsUrl ?? "/contact"}
              {...(bookingsUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => track("bookings_link_clicked", { location: "health_check_results" })}
              className="inline-flex items-center justify-center rounded-md bg-navy-700 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-navy-800"
            >
              Book a free 15-minute walkthrough
            </a>
            <a
              href={site.phone.tel}
              className="inline-flex items-center justify-center rounded-md border border-navy-300 px-6 py-3 text-sm font-semibold text-navy-800 hover:border-navy-700"
            >
              Or call {site.phone.display}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-cream-200 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="hc-domain" className="mb-1.5 block text-sm font-semibold text-ink-900">
            Your domain or work email <span aria-hidden="true" className="text-brass-600">*</span>
          </label>
          <input
            id="hc-domain"
            name="domainOrEmail"
            required
            maxLength={254}
            placeholder="yourbusiness.com — or you@yourbusiness.com"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-ink-500">
            On Gmail or another free service? Enter that — it&apos;s useful information, not a
            dead end.
          </p>
        </div>
        <div>
          <label htmlFor="hc-name" className="mb-1.5 block text-sm font-semibold text-ink-900">
            Your name <span aria-hidden="true" className="text-brass-600">*</span>
          </label>
          <input id="hc-name" name="name" required maxLength={120} autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="hc-email" className="mb-1.5 block text-sm font-semibold text-ink-900">
            Email for your report <span aria-hidden="true" className="text-brass-600">*</span>
          </label>
          <input id="hc-email" name="email" type="email" required maxLength={200} autoComplete="email" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="hc-phone" className="mb-1.5 block text-sm font-semibold text-ink-900">
            Phone <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input id="hc-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={inputCls} />
        </div>
      </div>
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="hc-company-website">Leave this empty</label>
        <input id="hc-company-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-4 rounded-md border border-brass-400 bg-cream-100 px-4 py-3 text-sm font-medium text-ink-900">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "running"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-700 px-8 py-4 text-base font-semibold text-cream-50 transition-colors hover:bg-navy-800 disabled:opacity-60 sm:w-auto"
      >
        {status === "running" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Reading public records…
          </>
        ) : (
          <>
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Run my free check
          </>
        )}
      </button>
      <p className="mt-3 text-xs text-ink-500">
        Passive public-DNS lookups only — we never scan, probe, or touch your systems. Your
        graded report is emailed to you; we may follow up about it. See our{" "}
        <a href="/privacy" className="underline">privacy policy</a>.
      </p>
    </form>
  );
}
