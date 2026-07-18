"use client";

import { useState } from "react";
import { CalendarClock, Loader2, XCircle } from "lucide-react";
import { SlotPicker, type SelectedSlot } from "./SlotPicker";
import { site } from "@/lib/site";

type Mode = "view" | "reschedule" | "confirm-cancel" | "done-cancel" | "done-reschedule";

export function ManageBooking({
  token,
  bookingId,
  serviceSlug,
  canCancelOnline,
  paid,
}: {
  token: string;
  bookingId: string;
  serviceSlug: string;
  canCancelOnline: boolean;
  /** False for $0 promo bookings — no refund language anywhere. */
  paid: boolean;
}) {
  const [mode, setMode] = useState<Mode>("view");
  const [slot, setSlot] = useState<SelectedSlot | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function post(body: object): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch("/api/bookings/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    return { ok: res.ok && Boolean(data.ok), error: data.error };
  }

  async function cancel() {
    setBusy(true);
    setError(null);
    const result = await post({ action: "cancel", token });
    setBusy(false);
    if (result.ok) {
      setMode("done-cancel");
    } else {
      setError(result.error ?? `Something went wrong — call us at ${site.phone.display}.`);
      setMode("view");
    }
  }

  async function reschedule() {
    if (!slot) return;
    setBusy(true);
    setError(null);
    const result = await post({ action: "reschedule", token, start: slot.start });
    setBusy(false);
    if (result.ok) {
      setMode("done-reschedule");
    } else {
      setSlot(null);
      setError(result.error ?? `Something went wrong — call us at ${site.phone.display}.`);
    }
  }

  if (mode === "done-cancel") {
    return (
      <div role="status" className="rounded-lg border border-navy-200 bg-navy-50 p-6 text-center">
        <h2 className="font-serif text-2xl font-semibold text-ink-900">
          {paid ? "Canceled — refund issued." : "Canceled."}
        </h2>
        <p className="mt-2 text-base text-ink-700">
          {paid
            ? "Your full refund is on its way to your original payment method (allow 5–10 business days). A confirmation email is headed your way too."
            : "Your appointment is canceled — there was no charge, so there's nothing to refund. A confirmation email is headed your way."}
        </p>
      </div>
    );
  }

  if (mode === "done-reschedule") {
    return (
      <div role="status" className="rounded-lg border border-navy-200 bg-navy-50 p-6 text-center">
        <h2 className="font-serif text-2xl font-semibold text-ink-900">
          Rescheduled{slot ? ` — ${slot.dayLabel} at ${slot.slotLabel}` : ""}.
        </h2>
        <p className="mt-2 text-base text-ink-700">
          A fresh confirmation with an updated calendar invite is on its way to your inbox.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-5 rounded-md border border-brass-400 bg-cream-100 px-4 py-3 text-sm font-medium text-ink-900">
          {error}
        </p>
      ) : null}

      {mode === "view" ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setMode("reschedule")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-700 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Reschedule (free)
          </button>
          {canCancelOnline ? (
            <button
              onClick={() => setMode("confirm-cancel")}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-cream-300 px-6 py-3 text-sm font-semibold text-ink-700 hover:border-brass-500 hover:text-ink-900"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              {paid ? "Cancel & refund" : "Cancel appointment"}
            </button>
          ) : (
            <p className="flex items-center text-sm text-ink-500">
              Inside 24 hours — to cancel, call{" "}
              <a href={site.phone.tel} className="ml-1 font-bold text-navy-700">
                {site.phone.display}
              </a>
            </p>
          )}
        </div>
      ) : null}

      {mode === "confirm-cancel" ? (
        <div className="rounded-lg border border-cream-200 bg-white p-6">
          <h2 className="font-serif text-xl font-semibold text-ink-900">
            Cancel this appointment?
          </h2>
          <p className="mt-2 text-sm text-ink-700">
            {paid
              ? "You'll get a full, automatic refund to your original payment method. This can't be undone — but you can always book again."
              : "There was no charge for this booking, so there's nothing to refund. This can't be undone — but you can always book again."}
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={cancel}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md bg-navy-700 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-navy-800 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {paid ? "Yes — cancel & refund" : "Yes — cancel it"}
            </button>
            <button
              onClick={() => setMode("view")}
              disabled={busy}
              className="rounded-md border border-cream-300 px-6 py-3 text-sm font-semibold text-ink-700 hover:border-navy-400"
            >
              Keep my appointment
            </button>
          </div>
        </div>
      ) : null}

      {mode === "reschedule" ? (
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink-900">Pick a new time</h2>
          <div className="mt-4">
            <SlotPicker
              serviceSlug={serviceSlug}
              excludeBookingId={bookingId}
              selected={slot}
              onSelect={setSlot}
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={reschedule}
              disabled={!slot || busy}
              className="inline-flex items-center gap-2 rounded-md bg-navy-700 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-navy-800 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Confirm new time
            </button>
            <button
              onClick={() => {
                setMode("view");
                setSlot(null);
              }}
              className="rounded-md border border-cream-300 px-6 py-3 text-sm font-semibold text-ink-700 hover:border-navy-400"
            >
              Never mind
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
