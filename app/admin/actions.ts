"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb, hasDb } from "@/lib/db";
import { posts, newsletters } from "@/lib/db/schema";
import {
  grantAdminCookie,
  revokeAdminCookie,
  isAdmin,
  isAdminConfigured,
} from "@/lib/admin/auth";
import {
  draftNextArticle,
  draftMonthlyNewsletter,
  sendNewsletter,
} from "@/lib/content-engine";
import { rateLimit } from "@/lib/rate-limit";

async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin?denied=1");
}

function requireDb() {
  if (!hasDb()) redirect("/admin?error=nodb");
  return getDb();
}

export async function loginAction(formData: FormData): Promise<void> {
  if (!isAdminConfigured()) redirect("/admin?error=unconfigured");
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await rateLimit({ name: "admin-login", identifier: ip, limit: 5, windowSeconds: 900 });
  if (!limit.ok) redirect("/admin?error=ratelimited");
  const secret = formData.get("secret");
  if (typeof secret !== "string" || secret !== process.env.ADMIN_SECRET) {
    redirect("/admin?error=badsecret");
  }
  await grantAdminCookie();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await revokeAdminCookie();
  redirect("/admin");
}

export async function generateDraftAction(): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const result = await draftNextArticle(db);
  revalidatePath("/admin");
  if (!result.ok) redirect(`/admin?error=${encodeURIComponent(result.reason ?? "draft failed")}`);
  redirect(`/admin/drafts/${result.postId}`);
}

export async function updatePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const contentMd = String(formData.get("contentMd") ?? "").trim();
  if (!id || !title || !description || !contentMd) redirect(`/admin/drafts/${id}?error=missing`);
  await db
    .update(posts)
    .set({ title, description, contentMd, updatedAt: new Date() })
    .where(eq(posts.id, id));
  revalidatePath("/admin");
  redirect(`/admin/drafts/${id}?saved=1`);
}

export async function approvePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin");
  await db
    .update(posts)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(posts.id, id));
  revalidatePath("/admin");
  revalidatePath("/blog");
  redirect("/admin?published=1");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await db.delete(posts).where(eq(posts.id, id));
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export async function generateNewsletterAction(): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const result = await draftMonthlyNewsletter(db);
  revalidatePath("/admin");
  if (!result.ok) redirect(`/admin?error=${encodeURIComponent(result.reason ?? "newsletter draft failed")}`);
  redirect("/admin?newsletter=drafted");
}

export async function updateNewsletterAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const id = String(formData.get("id") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  const contentMd = String(formData.get("contentMd") ?? "").trim();
  if (!id || !subject || !contentMd) redirect("/admin?error=missing");
  await db.update(newsletters).set({ subject, contentMd }).where(eq(newsletters.id, id));
  revalidatePath("/admin");
  redirect("/admin?newsletter=saved");
}

export async function sendNewsletterAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin");
  const result = await sendNewsletter(db, id);
  revalidatePath("/admin");
  redirect(
    result.ok
      ? `/admin?newsletter=queued&count=${result.queued}`
      : `/admin?error=${encodeURIComponent(result.reason ?? "send failed")}`
  );
}
