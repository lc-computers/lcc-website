import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import Markdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getDb, hasDb } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { isAdmin } from "@/lib/admin/auth";
import { approvePostAction, deletePostAction, updatePostAction } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Draft",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const btn =
  "inline-flex items-center gap-2 rounded-md bg-navy-700 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800";
const btnGhost =
  "inline-flex items-center gap-2 rounded-md border border-cream-300 px-4 py-2 text-sm font-semibold text-ink-700 hover:border-navy-400";

export default async function DraftEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await isAdmin())) redirect("/admin");
  if (!hasDb()) redirect("/admin?error=nodb");
  const { id } = await params;
  const { saved } = await searchParams;
  const db = getDb();
  const [post] = await db.select().from(posts).where(eq(posts.id, id));
  if (!post) notFound();

  return (
    <Container className="py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to admin
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-ink-900">
          {post.status === "draft" ? "Review draft" : "Edit published post"}
        </h1>
        <div className="flex gap-2">
          {post.status === "draft" ? (
            <>
              <form action={approvePostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className={btn}>Approve & publish</button>
              </form>
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className={btnGhost}>Discard</button>
              </form>
            </>
          ) : (
            <a href={`/blog/${post.slug}`} className={btnGhost}>View live</a>
          )}
        </div>
      </div>

      {saved ? (
        <p role="status" className="mt-4 rounded-md border border-navy-200 bg-navy-50 px-4 py-3 text-sm font-medium">
          Saved.
        </p>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form action={updatePostAction}>
          <input type="hidden" name="id" value={post.id} />
          <label htmlFor="draft-title" className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-500">
            Title
          </label>
          <input
            id="draft-title"
            name="title"
            defaultValue={post.title}
            className="w-full rounded-md border border-cream-300 px-3 py-2 text-base font-semibold focus:border-navy-500"
          />
          <label htmlFor="draft-desc" className="mb-1 mt-4 block text-xs font-bold uppercase tracking-wider text-ink-500">
            Meta description
          </label>
          <textarea
            id="draft-desc"
            name="description"
            rows={2}
            defaultValue={post.description}
            className="w-full rounded-md border border-cream-300 px-3 py-2 text-sm focus:border-navy-500"
          />
          <label htmlFor="draft-body" className="mb-1 mt-4 block text-xs font-bold uppercase tracking-wider text-ink-500">
            Body (markdown) — /blog/{post.slug}
          </label>
          <textarea
            id="draft-body"
            name="contentMd"
            rows={28}
            defaultValue={post.contentMd}
            className="w-full rounded-md border border-cream-300 px-3 py-2 font-mono text-xs leading-relaxed focus:border-navy-500"
          />
          <button type="submit" className={`${btn} mt-4`}>Save changes</button>
        </form>

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-500">Preview</p>
          <div className="rounded-lg border border-cream-200 bg-white p-6 shadow-card">
            <h2 className="font-serif text-2xl font-semibold text-ink-900">{post.title}</h2>
            <p className="mt-2 text-sm text-ink-500">{post.description}</p>
            <hr className="my-4 border-cream-200" />
            <div className="prose-site text-sm text-ink-700">
              <Markdown>{post.contentMd}</Markdown>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
