import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { isAdmin } from "@/lib/admin/auth";
import { hasDb } from "@/lib/db";
import { loadCatalog, type CatalogService } from "@/lib/booking/services";
import { DeleteServiceButton } from "@/components/admin/DeleteServiceButton";
import { saveServiceAction } from "../actions";

export const metadata: Metadata = {
  title: "Services & Pricing — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const btn =
  "inline-flex items-center gap-2 rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800";
const inputCls =
  "w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-ink-900 focus:border-navy-500";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wider text-ink-500";

function ServiceForm({ service }: { service?: CatalogService }) {
  const isNew = !service;
  return (
    <form action={saveServiceAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="slug" value={service?.slug ?? ""} />
      <div className="sm:col-span-2">
        <label htmlFor={`name-${service?.slug ?? "new"}`} className={labelCls}>
          Service name
        </label>
        <input
          id={`name-${service?.slug ?? "new"}`}
          name="name"
          required
          minLength={3}
          maxLength={80}
          defaultValue={service?.name}
          placeholder={isNew ? "e.g. Printer Setup & Troubleshooting" : undefined}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor={`price-${service?.slug ?? "new"}`} className={labelCls}>
          Price (dollars)
        </label>
        <input
          id={`price-${service?.slug ?? "new"}`}
          name="price"
          type="number"
          required
          min={0}
          max={5000}
          step="0.01"
          defaultValue={service ? service.priceCents / 100 : undefined}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor={`kind-${service?.slug ?? "new"}`} className={labelCls}>
          Type
        </label>
        <select
          id={`kind-${service?.slug ?? "new"}`}
          name="kind"
          defaultValue={service?.kind ?? "in_home"}
          className={inputCls}
        >
          <option value="in_home">In-home visit (address + travel fee rules apply)</option>
          <option value="remote">Remote session (no address, never a travel fee)</option>
        </select>
      </div>
      <div>
        <label htmlFor={`duration-${service?.slug ?? "new"}`} className={labelCls}>
          Appointment length (minutes)
        </label>
        <input
          id={`duration-${service?.slug ?? "new"}`}
          name="durationMinutes"
          type="number"
          required
          min={15}
          max={240}
          step={15}
          defaultValue={service?.durationMinutes ?? 90}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor={`buffer-${service?.slug ?? "new"}`} className={labelCls}>
          Travel buffer after (minutes, in-home only)
        </label>
        <input
          id={`buffer-${service?.slug ?? "new"}`}
          name="bufferMinutes"
          type="number"
          required
          min={0}
          max={120}
          step={15}
          defaultValue={service?.bufferMinutes ?? 30}
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`blurb-${service?.slug ?? "new"}`} className={labelCls}>
          Short description (shown on the menu and to the chat assistant)
        </label>
        <textarea
          id={`blurb-${service?.slug ?? "new"}`}
          name="blurb"
          rows={2}
          maxLength={600}
          defaultValue={service?.blurb}
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`includes-${service?.slug ?? "new"}`} className={labelCls}>
          What&apos;s included — one item per line (max 10)
        </label>
        <textarea
          id={`includes-${service?.slug ?? "new"}`}
          name="includes"
          rows={4}
          maxLength={2500}
          defaultValue={service?.includes.join("\n")}
          className={inputCls}
        />
      </div>
      <div className="flex items-center gap-6 sm:col-span-2">
        <div className="flex items-center gap-2">
          <label htmlFor={`sort-${service?.slug ?? "new"}`} className="text-xs font-bold uppercase tracking-wider text-ink-500">
            Display order
          </label>
          <input
            id={`sort-${service?.slug ?? "new"}`}
            name="sortOrder"
            type="number"
            min={0}
            max={99}
            defaultValue={service?.sortOrder ?? 50}
            className="w-20 rounded-md border border-cream-300 px-3 py-2 text-center text-sm focus:border-navy-500"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <input
            type="checkbox"
            name="active"
            defaultChecked={service?.active ?? true}
            className="h-4 w-4 accent-[#0C447C]"
          />
          Bookable (shown on the site)
        </label>
        <button type="submit" className={`${btn} ml-auto`}>
          {isNew ? (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add service
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await isAdmin())) redirect("/admin");
  if (!hasDb()) redirect("/admin?error=nodb");
  const params = await searchParams;
  const catalog = await loadCatalog();

  return (
    <Container className="py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to admin
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink-900">Services &amp; pricing</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-700">
        This menu drives the whole site: the booking flow, the prices on the home and
        home-services pages, and what the chat assistant recommends and quotes. Changes go live
        immediately. Existing bookings always keep the price the customer already paid. A service
        with bookings on record can&rsquo;t be deleted (past bookings still need its name) — uncheck
        &ldquo;Bookable&rdquo; to take it off the menu instead. Set a price of $0 to run a free
        promotion: customers book normally but skip payment entirely.
      </p>

      {params.error ? (
        <p role="alert" className="mt-5 rounded-md border border-brass-400 bg-cream-100 px-4 py-3 text-sm font-medium text-ink-900">
          {params.error}
        </p>
      ) : null}
      {params.saved ? (
        <p role="status" className="mt-5 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium">
          Saved — the site and booking flow show it now.
        </p>
      ) : null}
      {params.deleted ? (
        <p role="status" className="mt-5 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium">
          Deleted — it&rsquo;s gone from the site and booking flow.
        </p>
      ) : null}

      <div className="mt-8 space-y-5">
        {catalog.map((s) => (
          <details
            key={s.slug}
            className="rounded-lg border border-cream-200 bg-white shadow-card"
            open={params.saved === s.slug}
          >
            <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-2 p-5">
              <span className="font-serif text-lg font-semibold text-ink-900">
                {s.name}
                <span className="ml-2 font-sans text-base font-normal text-navy-700">
                  {s.priceDisplay}
                </span>
              </span>
              <span className="text-xs text-ink-500">
                {s.kind === "remote" ? "Remote" : "In-home"} · {s.durationMinutes} min
                {s.bufferMinutes > 0 ? ` + ${s.bufferMinutes} min travel` : ""} ·{" "}
                {s.active ? (
                  <span className="rounded-full bg-[#E8F2E8] px-2 py-0.5 font-bold text-[#2D5A2D]">bookable</span>
                ) : (
                  <span className="rounded-full bg-cream-100 px-2 py-0.5 font-bold text-ink-500">off the menu</span>
                )}
              </span>
            </summary>
            <div className="border-t border-cream-200 p-5">
              <p className="mb-4 text-xs text-ink-500">
                Booking link: /book?service={s.slug}
              </p>
              <ServiceForm service={s} />
              <div className="mt-5 border-t border-cream-200 pt-4">
                <DeleteServiceButton slug={s.slug} name={s.name} />
              </div>
            </div>
          </details>
        ))}
      </div>

      <section className="mt-10 rounded-lg border border-cream-200 bg-white p-5 shadow-card">
        <h2 className="font-serif text-xl font-semibold text-ink-900">Add a service</h2>
        <p className="mt-1 mb-4 text-sm text-ink-700">
          It appears on the site and in the booking flow as soon as you add it. In-home visits
          usually run 90 minutes + 30 travel; remote sessions 30 minutes, no buffer.
        </p>
        <ServiceForm />
      </section>
    </Container>
  );
}
