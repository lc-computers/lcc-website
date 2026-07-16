"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const inputCls =
  "w-full rounded-md border border-cream-300 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-500/60 focus:border-navy-500";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot — bots fill every field; humans never see this one
    if (data.get("company_website")) {
      setStatus("success");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone") || undefined,
          organization: data.get("organization") || undefined,
          message: data.get("message"),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong sending your message.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong sending your message.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-navy-200 bg-navy-50 p-8 text-center" role="status">
        <h3 className="font-serif text-2xl font-semibold text-ink-900">Got it — thank you.</h3>
        <p className="mt-3 text-base text-ink-700">
          Your message is in our inbox and we&apos;ll get back to you during business hours
          ({site.hours.short}). If it&apos;s urgent, call{" "}
          <a href={site.phone.tel} className="font-bold text-navy-700">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-ink-900">
            Name <span aria-hidden="true" className="text-brass-600">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-ink-900">
            Email <span aria-hidden="true" className="text-brass-600">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-semibold text-ink-900">
            Phone <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="contact-organization"
            className="mb-1.5 block text-sm font-semibold text-ink-900"
          >
            Organization <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input
            id="contact-organization"
            name="organization"
            type="text"
            maxLength={200}
            autoComplete="organization"
            className={inputCls}
          />
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-ink-900">
          How can we help? <span aria-hidden="true" className="text-brass-600">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          className={inputCls}
        />
      </div>
      {/* Honeypot field — hidden from real users */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-4 rounded-md border border-brass-400 bg-cream-100 px-4 py-3 text-sm font-medium text-ink-900">
          {error} You can also call us at {site.phone.display} or email {site.email}.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-navy-700 px-8 py-3.5 font-sans text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800 disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
