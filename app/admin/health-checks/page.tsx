import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getDb, hasDb } from "@/lib/db";
import { healthChecks } from "@/lib/db/schema";
import { isAdmin } from "@/lib/admin/auth";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Health Checks — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface GradedCategory {
  key: string;
  title: string;
  grade: string;
  finding: string;
}

/** results is jsonb { checks, graded } — read defensively. */
function categoriesOf(results: Record<string, unknown>): GradedCategory[] {
  const graded = results?.graded as { categories?: unknown } | undefined;
  if (!Array.isArray(graded?.categories)) return [];
  return graded.categories.filter(
    (c): c is GradedCategory =>
      typeof c === "object" && c !== null && "grade" in c && "title" in c
  );
}

const gradeCls: Record<string, string> = {
  A: "bg-[#E8F2E8] text-[#2D5A2D]",
  B: "bg-navy-50 text-navy-700",
  C: "bg-cream-100 text-[#8A6D1C]",
  D: "bg-[#F7E9E4] text-[#A03426]",
  F: "bg-[#F7E9E4] text-[#A03426]",
};

function GradeChip({ grade, large }: { grade: string; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-serif font-bold ${
        gradeCls[grade] ?? "bg-cream-100 text-ink-700"
      } ${large ? "h-10 w-10 text-xl" : "h-6 w-6 text-sm"}`}
    >
      {grade}
    </span>
  );
}

export default async function AdminHealthChecksPage() {
  if (!(await isAdmin())) redirect("/admin");
  if (!hasDb()) redirect("/admin?error=nodb");
  const rows = await getDb()
    .select()
    .from(healthChecks)
    .orderBy(desc(healthChecks.createdAt))
    .limit(200);

  return (
    <Container className="py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to admin
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink-900">
        Health checks{" "}
        <span className="text-lg font-normal text-ink-500">(latest {rows.length})</span>
      </h1>

      <div className="mt-6 space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-lg border border-cream-200 bg-white p-6 text-ink-500 shadow-card">
            No health checks yet. Every run of the free M365 Security Health Check lands here
            with its graded results.
          </p>
        ) : (
          rows.map((hc) => {
            const categories = categoriesOf(hc.results);
            return (
              <div key={hc.id} className="rounded-lg border border-cream-200 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <GradeChip grade={hc.overallGrade} large />
                    <div>
                      <p className="font-serif text-lg font-semibold text-ink-900">
                        {hc.domain}
                        {hc.freeMailProvider ? (
                          <span className="ml-2 rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-bold text-ink-500">
                            free-mail user
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm font-medium text-ink-700">
                        {hc.name} ·{" "}
                        <a href={`mailto:${hc.email}`} className="text-navy-700 hover:underline">
                          {hc.email}
                        </a>
                        {hc.phone ? (
                          <>
                            {" "}
                            ·{" "}
                            <a href={`tel:${hc.phone}`} className="text-navy-700 hover:underline">
                              {hc.phone}
                            </a>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-ink-500">{formatDateTime(hc.createdAt)}</p>
                </div>

                {categories.length > 0 ? (
                  <details className="mt-4">
                    <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-navy-700">
                      {categories.map((c) => (
                        <span key={c.key} className="inline-flex items-center gap-1.5">
                          <GradeChip grade={c.grade} />
                          <span className="text-xs font-bold uppercase tracking-wider text-ink-500">
                            {c.key}
                          </span>
                        </span>
                      ))}
                      <span className="ml-auto underline underline-offset-4">details</span>
                    </summary>
                    <dl className="mt-3 space-y-2 border-t border-cream-200 pt-3">
                      {categories.map((c) => (
                        <div key={c.key} className="flex gap-3">
                          <dt className="shrink-0">
                            <GradeChip grade={c.grade} />
                          </dt>
                          <dd className="text-sm text-ink-700">
                            <strong className="text-ink-900">{c.title}:</strong> {c.finding}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </Container>
  );
}
