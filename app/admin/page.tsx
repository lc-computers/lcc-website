import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { FileText, Mail, PenLine, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getDb, hasDb } from "@/lib/db";
import { posts, newsletters, leads, bookings, healthChecks } from "@/lib/db/schema";
import { isAdmin, isAdminConfigured } from "@/lib/admin/auth";
import { formatDateShort } from "@/lib/format";
import {
  loginAction,
  logoutAction,
  generateDraftAction,
  approvePostAction,
  deletePostAction,
  generateNewsletterAction,
  updateNewsletterAction,
  sendNewsletterAction,
  updateCapacityAction,
} from "./actions";
import { getCapacity, MIN_CAPACITY, MAX_CAPACITY } from "@/lib/booking/capacity";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const btn =
  "inline-flex items-center gap-2 rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800";
const btnGhost =
  "inline-flex items-center gap-2 rounded-md border border-cream-300 px-4 py-2 text-sm font-semibold text-ink-700 hover:border-navy-400";

const errorMessages: Record<string, string> = {
  unconfigured: "ADMIN_SECRET is not set — add it to the environment first.",
  badsecret: "That secret didn't match.",
  ratelimited: "Too many attempts — wait 15 minutes.",
  nodb: "DATABASE_URL is not configured.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  if (!(await isAdmin())) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-sm rounded-lg border border-cream-200 bg-white p-8 shadow-card">
          <h1 className="font-serif text-2xl font-semibold text-ink-900">Admin</h1>
          {!isAdminConfigured() ? (
            <p className="mt-3 text-sm text-ink-700">
              Set <code className="rounded bg-cream-100 px-1.5 py-0.5">ADMIN_SECRET</code> in the
              environment to enable the admin area.
            </p>
          ) : (
            <form action={loginAction} className="mt-5">
              <label htmlFor="admin-secret" className="mb-1.5 block text-sm font-semibold text-ink-900">
                Admin secret
              </label>
              <input
                id="admin-secret"
                name="secret"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-cream-300 px-4 py-3 text-base focus:border-navy-500"
              />
              {params.error ? (
                <p role="alert" className="mt-3 text-sm font-medium text-[#A03426]">
                  {errorMessages[params.error] ?? params.error}
                </p>
              ) : null}
              <button type="submit" className={`${btn} mt-4 w-full justify-center`}>
                Sign in
              </button>
            </form>
          )}
        </div>
      </Container>
    );
  }

  if (!hasDb()) {
    return (
      <Container className="py-20">
        <p className="text-ink-700">DATABASE_URL is not configured — the content engine needs the database.</p>
      </Container>
    );
  }

  const db = getDb();
  const capacity = await getCapacity(db);
  const [draftRows, publishedRows, newsletterRows, [counts]] = await Promise.all([
    db.select().from(posts).where(eq(posts.status, "draft")).orderBy(desc(posts.createdAt)),
    db.select().from(posts).where(eq(posts.status, "published")).orderBy(desc(posts.publishedAt)).limit(20),
    db.select().from(newsletters).orderBy(desc(newsletters.createdAt)).limit(6),
    db
      .select({
        leads: sql<number>`(select count(*) from ${leads})`,
        bookings: sql<number>`(select count(*) from ${bookings} where ${bookings.status} in ('confirmed','completed'))`,
        healthChecks: sql<number>`(select count(*) from ${healthChecks})`,
      })
      .from(sql`(select 1) as t`),
  ]);

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Content engine</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">Admin</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className={btnGhost}>Sign out</button>
        </form>
      </div>

      {params.error ? (
        <p role="alert" className="mt-5 rounded-md border border-brass-400 bg-cream-100 px-4 py-3 text-sm font-medium text-ink-900">
          {errorMessages[params.error] ?? params.error}
        </p>
      ) : null}
      {params.published ? (
        <p role="status" className="mt-5 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium">
          Published — it&apos;s live on the blog.
        </p>
      ) : null}
      {params.newsletter === "queued" ? (
        <p role="status" className="mt-5 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium">
          Newsletter queued to {params.count ?? "0"} recipients (suppression respected; sends via the hourly cron).
        </p>
      ) : null}
      {params.capacity === "saved" ? (
        <p role="status" className="mt-5 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium">
          Scheduling capacity updated — the booking calendar reflects it immediately.
        </p>
      ) : null}

      {/* Stats — tiles link to the detail views */}
      <dl className="mt-8 grid grid-cols-3 gap-4">
        {[
          { label: "Leads", value: counts?.leads ?? 0, href: "/admin/leads" },
          { label: "Bookings", value: counts?.bookings ?? 0, href: "/admin/bookings" },
          { label: "Health checks", value: counts?.healthChecks ?? 0, href: "/admin/health-checks" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-cream-200 bg-white p-4 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
          >
            <dd className="font-serif text-3xl font-semibold text-navy-700">{s.value}</dd>
            <dt className="mt-1 text-xs font-bold uppercase tracking-wider text-ink-500">
              {s.label} →
            </dt>
          </Link>
        ))}
      </dl>

      {/* Scheduling capacity */}
      <section className="mt-10 rounded-lg border border-cream-200 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink-900">Scheduling capacity</h2>
            <p className="mt-1 max-w-xl text-sm text-ink-700">
              How many technicians are taking appointments. Each open time slot accepts this many
              overlapping bookings — set it to 1 and every slot is single-booked; raise it when a
              second tech is on the schedule. Applies to new bookings immediately (existing
              bookings are never touched).
            </p>
          </div>
          <form action={updateCapacityAction} className="flex shrink-0 items-center gap-3">
            <label htmlFor="technicians" className="text-sm font-semibold text-ink-900">
              Technicians
            </label>
            <input
              id="technicians"
              name="technicians"
              type="number"
              min={MIN_CAPACITY}
              max={MAX_CAPACITY}
              defaultValue={capacity}
              className="w-20 rounded-md border border-cream-300 px-3 py-2 text-center text-base font-semibold focus:border-navy-500"
            />
            <button type="submit" className={btn}>Save</button>
          </form>
        </div>
      </section>

      {/* Service menu */}
      <section className="mt-5 rounded-lg border border-cream-200 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink-900">Services &amp; pricing</h2>
            <p className="mt-1 max-w-xl text-sm text-ink-700">
              Add residential services, change prices and descriptions, or take something off the
              menu. Updates the booking flow, the public pages, and the chat assistant immediately.
            </p>
          </div>
          <Link href="/admin/services" className={`${btn} shrink-0`}>
            Manage services
          </Link>
        </div>
      </section>

      {/* Drafts */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">
            Drafts awaiting review ({draftRows.length})
          </h2>
          <form action={generateDraftAction}>
            <button type="submit" className={btn}>
              <PenLine className="h-4 w-4" aria-hidden="true" />
              Draft next topic
            </button>
          </form>
        </div>
        <ul className="mt-4 divide-y divide-cream-200 rounded-lg border border-cream-200 bg-white shadow-card">
          {draftRows.length === 0 ? (
            <li className="p-5 text-sm text-ink-500">
              No drafts waiting. The weekly cron adds one every Monday, or draft one now.
            </li>
          ) : (
            draftRows.map((d) => (
              <li key={d.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/admin/drafts/${d.id}`} className="font-semibold text-navy-700 hover:underline">
                    {d.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-500">
                    drafted {formatDateShort(d.createdAt)} · /blog/{d.slug}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/admin/drafts/${d.id}`} className={btnGhost}>
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Review & edit
                  </Link>
                  <form action={approvePostAction}>
                    <input type="hidden" name="id" value={d.id} />
                    <button type="submit" className={btn}>Approve & publish</button>
                  </form>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={d.id} />
                    <button type="submit" className={btnGhost}>Discard</button>
                  </form>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Published */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-ink-900">Published</h2>
        <ul className="mt-4 divide-y divide-cream-200 rounded-lg border border-cream-200 bg-white shadow-card">
          {publishedRows.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <a href={`/blog/${p.slug}`} className="font-medium text-navy-700 hover:underline">
                  {p.title}
                </a>
                <span className="ml-2 text-xs text-ink-500">
                  {p.publishedAt ? formatDateShort(p.publishedAt) : ""}
                  {p.source === "launch" ? " · launch article" : ""}
                </span>
              </div>
              <Link href={`/admin/drafts/${p.id}`} className="text-sm font-semibold text-ink-500 hover:text-navy-700">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Newsletters */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-ink-900">Newsletter</h2>
          <form action={generateNewsletterAction}>
            <button type="submit" className={btn}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Draft this month&apos;s digest
            </button>
          </form>
        </div>
        <div className="mt-4 space-y-4">
          {newsletterRows.length === 0 ? (
            <p className="rounded-lg border border-cream-200 bg-white p-5 text-sm text-ink-500 shadow-card">
              No newsletters yet. The monthly cron drafts one on the 1st, or draft one now.
            </p>
          ) : (
            newsletterRows.map((n) => (
              <div key={n.id} className="rounded-lg border border-cream-200 bg-white p-5 shadow-card">
                {n.status === "sent" ? (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink-900">{n.subject}</p>
                      <p className="text-xs text-ink-500">
                        Sent {n.sentAt ? formatDateShort(n.sentAt) : ""} to {n.recipientCount ?? 0} recipients
                      </p>
                    </div>
                    <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-700">SENT</span>
                  </div>
                ) : (
                  <form action={updateNewsletterAction}>
                    <input type="hidden" name="id" value={n.id} />
                    <label htmlFor={`nl-subject-${n.id}`} className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-500">
                      Subject
                    </label>
                    <input
                      id={`nl-subject-${n.id}`}
                      name="subject"
                      defaultValue={n.subject}
                      className="w-full rounded-md border border-cream-300 px-3 py-2 text-sm focus:border-navy-500"
                    />
                    <label htmlFor={`nl-body-${n.id}`} className="mb-1 mt-3 block text-xs font-bold uppercase tracking-wider text-ink-500">
                      Body (markdown)
                    </label>
                    <textarea
                      id={`nl-body-${n.id}`}
                      name="contentMd"
                      rows={10}
                      defaultValue={n.contentMd}
                      className="w-full rounded-md border border-cream-300 px-3 py-2 font-mono text-xs leading-relaxed focus:border-navy-500"
                    />
                    <div className="mt-3 flex gap-2">
                      <button type="submit" className={btnGhost}>Save draft</button>
                      <button type="submit" formAction={sendNewsletterAction} className={btn}>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Approve & send to nurture list
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </Container>
  );
}
