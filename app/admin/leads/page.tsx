import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getDb, hasDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { isAdmin } from "@/lib/admin/auth";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Leads — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const sourceLabels: Record<string, string> = {
  contact: "Contact form",
  chat: "Chat agent",
  health_check: "Health check",
  booking: "Booking",
};

export default async function AdminLeadsPage() {
  if (!(await isAdmin())) redirect("/admin");
  if (!hasDb()) redirect("/admin?error=nodb");
  const rows = await getDb().select().from(leads).orderBy(desc(leads.createdAt)).limit(200);

  return (
    <Container className="py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to admin
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink-900">
        Leads <span className="text-lg font-normal text-ink-500">(latest {rows.length})</span>
      </h1>

      <div className="mt-6 space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-lg border border-cream-200 bg-white p-6 text-ink-500 shadow-card">
            No leads yet. They land here from the contact form, chat agent, health check, and
            booking flow.
          </p>
        ) : (
          rows.map((lead) => (
            <div key={lead.id} className="rounded-lg border border-cream-200 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-serif text-lg font-semibold text-ink-900">
                  {lead.name ?? "(no name)"}
                  {lead.organization ? (
                    <span className="ml-2 text-sm font-normal text-ink-500">{lead.organization}</span>
                  ) : null}
                </p>
                <p className="text-xs text-ink-500">
                  <span className="mr-2 rounded-full bg-navy-50 px-2.5 py-0.5 font-bold text-navy-700">
                    {sourceLabels[lead.source] ?? lead.source}
                  </span>
                  {formatDateTime(lead.createdAt)}
                </p>
              </div>
              <p className="mt-1.5 text-sm font-medium text-ink-700">
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="text-navy-700 hover:underline">{lead.email}</a>
                ) : null}
                {lead.email && lead.phone ? " · " : ""}
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="text-navy-700 hover:underline">{lead.phone}</a>
                ) : null}
              </p>
              {lead.message ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-ink-700">{lead.message}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </Container>
  );
}
