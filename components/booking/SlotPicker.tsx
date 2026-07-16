"use client";

import { useEffect, useState } from "react";
import { CalendarX2, Loader2 } from "lucide-react";
import { site } from "@/lib/site";

export interface DayAvailability {
  date: string;
  label: string;
  slots: { start: string; label: string }[];
}

export interface SelectedSlot {
  start: string;
  slotLabel: string;
  dayLabel: string;
}

/**
 * Live slot picker: day rail + time grid. Labels are formatted server-side in
 * America/Chicago so every visitor sees Central Time.
 */
export function SlotPicker({
  serviceSlug,
  excludeBookingId,
  selected,
  onSelect,
}: {
  serviceSlug: string;
  excludeBookingId?: string;
  selected: SelectedSlot | null;
  onSelect: (slot: SelectedSlot) => void;
}) {
  const [days, setDays] = useState<DayAvailability[] | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDays(null);
    setError(null);
    const params = new URLSearchParams({ service: serviceSlug });
    if (excludeBookingId) params.set("excludeBooking", excludeBookingId);
    fetch(`/api/availability?${params}`)
      .then(async (res) => {
        const data = (await res.json()) as { days?: DayAvailability[]; error?: string };
        if (cancelled) return;
        if (!res.ok || !data.days) {
          setError(data.error ?? "Couldn't load available times.");
          setDays([]);
          return;
        }
        setDays(data.days);
        setActiveDay(data.days[0]?.date ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Couldn't load available times.");
          setDays([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [serviceSlug, excludeBookingId]);

  if (days === null) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-cream-200 bg-white p-8 text-ink-500">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Checking live availability…
      </div>
    );
  }

  if (error || days.length === 0) {
    return (
      <div className="rounded-lg border border-cream-200 bg-white p-8 text-center">
        <CalendarX2 className="mx-auto h-8 w-8 text-navy-300" aria-hidden="true" />
        <p className="mt-3 font-semibold text-ink-900">
          {error ?? "No open times in the next two weeks."}
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Call us at{" "}
          <a href={site.phone.tel} className="font-bold text-navy-700">
            {site.phone.display}
          </a>{" "}
          and we&apos;ll find you a time.
        </p>
      </div>
    );
  }

  const active = days.find((d) => d.date === activeDay) ?? days[0];

  return (
    <div>
      <p className="text-sm font-medium text-ink-500">
        All times are Central Time. Pick a day, then a start time.
      </p>
      <div
        role="tablist"
        aria-label="Available days"
        className="mt-4 flex gap-2 overflow-x-auto pb-2"
      >
        {days.map((day) => (
          <button
            key={day.date}
            role="tab"
            aria-selected={day.date === active?.date}
            onClick={() => setActiveDay(day.date)}
            className={`shrink-0 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors ${
              day.date === active?.date
                ? "border-navy-700 bg-navy-700 text-cream-50"
                : "border-cream-300 bg-white text-ink-700 hover:border-navy-400"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {active?.slots.map((slot) => {
          const isSelected = selected?.start === slot.start;
          return (
            <button
              key={slot.start}
              onClick={() =>
                onSelect({ start: slot.start, slotLabel: slot.label, dayLabel: active.label })
              }
              aria-pressed={isSelected}
              className={`rounded-md border px-2 py-2.5 text-sm font-semibold transition-colors ${
                isSelected
                  ? "border-brass-500 bg-brass-500 text-navy-950"
                  : "border-cream-300 bg-white text-ink-700 hover:border-navy-400 hover:text-navy-700"
              }`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
