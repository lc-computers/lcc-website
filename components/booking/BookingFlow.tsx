"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, BadgeCheck, Car, Loader2, Lock, Phone } from "lucide-react";
import { SlotPicker, type SelectedSlot } from "./SlotPicker";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { track } from "@/lib/analytics/client";
import { travelFeeCents } from "@/lib/booking/travel-fee";
import { formatMoney } from "@/lib/format";
import { site, residentialServices, type ResidentialService } from "@/lib/site";

type Step = 1 | 2 | 3 | 4;

interface Details {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  smsConsent: boolean;
}

const emptyDetails: Details = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  zip: "",
  smsConsent: false,
};

const inputCls =
  "w-full rounded-md border border-cream-300 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-500/50 focus:border-navy-500";

const stepTitles = ["Service", "Your details", "Pick a time", "Review & pay"];

export function BookingFlow({ preselect, canceled }: { preselect?: string; canceled?: boolean }) {
  const preselected = residentialServices.find((s) => s.slug === preselect) ?? null;
  const [step, setStep] = useState<Step>(preselected ? 2 : 1);
  const [service, setService] = useState<ResidentialService | null>(preselected);
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [slot, setSlot] = useState<SelectedSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Hide the "no charge was made" note once the visitor moves toward paying again.
  const dismissedCancelNotice = step === 4 && submitting;

  const fee = useMemo(
    () => (service ? travelFeeCents(service, details.city, details.zip) : 0),
    [service, details.city, details.zip]
  );
  const total = (service?.priceCents ?? 0) + fee;
  const isRemote = service?.kind === "remote";
  const showFee = service && !isRemote && details.city.trim().length >= 3;

  function choose(s: ResidentialService) {
    setService(s);
    setSlot(null);
    setStep(2);
    track("book_step_completed", { step: "service", service: s.slug });
  }

  function submitDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep(3);
    track("book_step_completed", { step: "details", service: service?.slug ?? "" });
  }

  async function pay() {
    if (!service || !slot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: service.slug,
          start: slot.start,
          name: details.name,
          email: details.email,
          phone: details.phone,
          ...(isRemote
            ? {}
            : { street: details.street, city: details.city, zip: details.zip }),
          smsConsent: details.smsConsent,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string; code?: string };
      if (res.ok && data.url) {
        track("book_step_completed", { step: "checkout", service: service.slug });
        window.location.href = data.url;
        return;
      }
      if (data.code === "slot_unavailable") {
        setSlot(null);
        setStep(3);
        setError(data.error ?? "That time was just taken — please pick another slot.");
      } else {
        setError(data.error ?? `Something went wrong. Call us at ${site.phone.display}.`);
      }
    } catch {
      setError(`Something went wrong. Call us at ${site.phone.display}.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm" aria-label="Booking steps">
        {stepTitles.map((title, i) => {
          const n = (i + 1) as Step;
          const state = n < step ? "done" : n === step ? "current" : "todo";
          return (
            <li key={title} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden="true" className="text-cream-300">—</span> : null}
              <span
                aria-current={state === "current" ? "step" : undefined}
                className={`flex items-center gap-1.5 ${
                  state === "current"
                    ? "font-semibold text-navy-800"
                    : state === "done"
                      ? "font-semibold text-brass-700"
                      : "font-normal text-ink-500"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                    state === "current"
                      ? "border-navy-700 bg-navy-700 text-cream-50"
                      : state === "done"
                        ? "border-brass-500 bg-brass-500 text-navy-950"
                        : "border-cream-300 text-ink-500"
                  }`}
                >
                  {n}
                </span>
                {title}
              </span>
            </li>
          );
        })}
      </ol>

      {canceled && !dismissedCancelNotice ? (
        <p role="status" className="mt-5 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium text-ink-900">
          No charge was made. Pick up where you left off whenever you&apos;re ready — or call{" "}
          {site.phone.display}.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-5 rounded-md border border-brass-400 bg-cream-100 px-4 py-3 text-sm font-medium text-ink-900">
          {error}
        </p>
      ) : null}

      <div className="mt-8">
        {/* Step 1 — service */}
        {step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {residentialServices.map((s) => (
              <button
                key={s.slug}
                onClick={() => choose(s)}
                className="group flex h-full flex-col rounded-lg border border-cream-200 bg-white p-6 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-navy-400 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-lg font-semibold text-ink-900 group-hover:text-navy-700">
                    {s.name}
                  </span>
                  <span className="font-serif text-2xl font-semibold text-navy-700">
                    {s.priceDisplay}
                  </span>
                </span>
                <span className="mt-2 flex-1 text-sm text-ink-500">{s.blurb}</span>
                <span className="mt-4 text-sm font-bold text-navy-700">
                  Select →
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {/* Step 2 — details */}
        {step === 2 && service ? (
          <form onSubmit={submitDetails} className="max-w-2xl">
            <ServiceSummary service={service} onChange={() => setStep(1)} />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" id="bk-name" required>
                <input
                  id="bk-name" required maxLength={120} autoComplete="name" className={inputCls}
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                />
              </Field>
              <Field label="Email" id="bk-email" required hint="Your confirmation lands here">
                <input
                  id="bk-email" type="email" required maxLength={200} autoComplete="email" className={inputCls}
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                />
              </Field>
              <Field label="Mobile phone" id="bk-phone" required hint={isRemote ? "We call this number at your appointment time" : undefined}>
                <input
                  id="bk-phone" type="tel" required minLength={10} maxLength={30} autoComplete="tel" className={inputCls}
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                />
              </Field>
              {!isRemote ? (
                <>
                  <Field label="Street address" id="bk-street" required>
                    <input
                      id="bk-street" required maxLength={200} autoComplete="street-address" className={inputCls}
                      value={details.street}
                      onChange={(e) => setDetails({ ...details, street: e.target.value })}
                    />
                  </Field>
                  <Field label="City / town" id="bk-city" required>
                    <input
                      id="bk-city" required maxLength={100} autoComplete="address-level2" className={inputCls}
                      value={details.city}
                      onChange={(e) => setDetails({ ...details, city: e.target.value })}
                    />
                  </Field>
                  <Field label="ZIP" id="bk-zip" required>
                    <input
                      id="bk-zip" required pattern="\d{5}(-\d{4})?" maxLength={10} autoComplete="postal-code" inputMode="numeric" className={inputCls}
                      value={details.zip}
                      onChange={(e) => setDetails({ ...details, zip: e.target.value })}
                    />
                  </Field>
                </>
              ) : null}
            </div>

            {showFee ? (
              <p className="mt-5 flex items-start gap-2.5 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium text-ink-900" role="status">
                <Car className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" aria-hidden="true" />
                {fee === 0
                  ? "Russell Springs address — no travel fee. Your total stays " + formatMoney(total) + "."
                  : `Outside Russell Springs — a flat ${formatMoney(fee)} travel fee applies. Total: ${formatMoney(total)}.`}
              </p>
            ) : null}
            {isRemote ? (
              <p className="mt-5 flex items-start gap-2.5 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium text-ink-900">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" aria-hidden="true" />
                Remote session — no address needed and never a travel fee. Total: {formatMoney(total)}.
              </p>
            ) : null}

            <label className="mt-6 flex items-start gap-3 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={details.smsConsent}
                onChange={(e) => setDetails({ ...details, smsConsent: e.target.checked })}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#0C447C]"
              />
              <span>
                Text me appointment updates (confirmation, reminder, follow-up). Optional — not
                required to book. Message/data rates may apply; reply STOP anytime.
              </span>
            </label>

            <div className="mt-8 flex items-center gap-4">
              <BackButton onClick={() => setStep(1)} />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-navy-700 px-8 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800"
              >
                Choose a time →
              </button>
            </div>
          </form>
        ) : null}

        {/* Step 3 — time */}
        {step === 3 && service ? (
          <div className="max-w-3xl">
            <ServiceSummary service={service} onChange={() => setStep(1)} />
            <div className="mt-6">
              <SlotPicker
                serviceSlug={service.slug}
                selected={slot}
                onSelect={(s) => {
                  setSlot(s);
                  setError(null);
                }}
              />
            </div>
            <div className="mt-8 flex items-center gap-4">
              <BackButton onClick={() => setStep(2)} />
              <button
                onClick={() => {
                  if (slot) {
                    setStep(4);
                    track("book_step_completed", { step: "slot", service: service.slug });
                  }
                }}
                disabled={!slot}
                className="inline-flex items-center justify-center rounded-md bg-navy-700 px-8 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-800 disabled:opacity-50"
              >
                Review booking →
              </button>
            </div>
          </div>
        ) : null}

        {/* Step 4 — review & pay */}
        {step === 4 && service && slot ? (
          <div className="max-w-2xl">
            <div className="rounded-lg border border-cream-200 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-ink-900">Look right?</h2>
              <dl className="mt-5 space-y-3 text-base">
                <Row label="Service" value={service.name} />
                <Row label="When" value={`${slot.dayLabel} at ${slot.slotLabel} (Central Time)`} />
                <Row
                  label={isRemote ? "How" : "Where"}
                  value={
                    isRemote
                      ? `We call ${details.phone} and connect by secure screen share`
                      : `${details.street}, ${details.city}, KY ${details.zip}`
                  }
                />
                <Row label="Name" value={details.name} />
                <div className="border-t border-cream-200 pt-3">
                  <Row label={service.name} value={formatMoney(service.priceCents)} />
                  {!isRemote ? (
                    <Row
                      label="Travel fee"
                      value={fee === 0 ? "None — Russell Springs" : formatMoney(fee)}
                    />
                  ) : null}
                  <div className="mt-2 flex items-baseline justify-between border-t border-cream-200 pt-3">
                    <dt className="font-serif text-lg font-semibold text-ink-900">Total due now</dt>
                    <dd className="font-serif text-2xl font-semibold text-navy-700">
                      {formatMoney(total)}
                    </dd>
                  </div>
                </div>
              </dl>
              <p className="mt-5 text-sm text-ink-500">
                {site.cancellation.policy} No sales tax — services only.
              </p>
              <button
                onClick={pay}
                disabled={submitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-700 px-8 py-4 text-base font-semibold text-cream-50 transition-colors hover:bg-navy-800 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Reserving your slot…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    Pay {formatMoney(total)} & confirm
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-ink-500">
                Secure payment by Stripe. We never see your card number.
              </p>
            </div>
            <div className="mt-6">
              <BackButton onClick={() => setStep(3)} label="Change time" />
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-10 flex items-center gap-2 border-t border-cream-200 pt-6 text-sm font-medium text-ink-700">
        <Phone className="h-4 w-4 text-navy-700" aria-hidden="true" />
        Prefer to call?{" "}
        <PhoneLink location={`book_step_${step}`} className="font-bold text-navy-700 hover:text-navy-900" />
        {" "}— a person answers, {site.hours.short}.
      </p>
    </div>
  );
}

function ServiceSummary({
  service,
  onChange,
}: {
  service: ResidentialService;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-cream-200 bg-cream-100 px-4 py-3">
      <p className="text-sm font-semibold text-ink-900">
        {service.name} — {service.priceDisplay}
      </p>
      <button type="button" onClick={onChange} className="text-sm font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900">
        Change
      </button>
    </div>
  );
}

function Field({
  label,
  id,
  required,
  hint,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-900">
        {label}{" "}
        {required ? (
          <span aria-hidden="true" className="text-brass-600">*</span>
        ) : (
          <span className="font-normal text-ink-500">(optional)</span>
        )}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-sm font-semibold text-ink-500">{label}</dt>
      <dd className="text-right font-medium text-ink-900">{value}</dd>
    </div>
  );
}

function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-navy-700"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
