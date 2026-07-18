"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, hasDb } from "@/lib/db";
import { posts, newsletters, services, bookings } from "@/lib/db/schema";
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
import { setCapacity } from "@/lib/booking/capacity";
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

export async function updateCapacityAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const n = Number(formData.get("technicians"));
  await setCapacity(db, n);
  revalidatePath("/admin");
  redirect("/admin?capacity=saved");
}

/* ---------------- Residential service menu ---------------- */

const serviceFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/)
    .max(64),
  name: z.string().trim().min(3).max(80),
  price: z.coerce.number().min(0).max(5000),
  kind: z.enum(["in_home", "remote"]),
  durationMinutes: z.coerce.number().int().min(15).max(240),
  bufferMinutes: z.coerce.number().int().min(0).max(120),
  sortOrder: z.coerce.number().int().min(0).max(99),
  blurb: z.string().trim().max(600),
  includes: z.string().max(2500),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

/** Pages that render the residential menu — regenerate after any edit. */
function revalidateServicePages(): void {
  revalidatePath("/");
  revalidatePath("/home-services");
  revalidatePath("/book");
  revalidatePath("/areas/[slug]", "page");
  revalidatePath("/admin/services");
}

export async function saveServiceAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const parsed = serviceFormSchema.safeParse({
    slug: formData.get("slug") ?? "",
    name: formData.get("name") ?? "",
    price: formData.get("price") ?? "",
    kind: formData.get("kind") ?? "",
    durationMinutes: formData.get("durationMinutes") ?? "",
    bufferMinutes: formData.get("bufferMinutes") ?? "",
    sortOrder: formData.get("sortOrder") ?? "",
    blurb: formData.get("blurb") ?? "",
    includes: formData.get("includes") ?? "",
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    redirect(
      `/admin/services?error=${encodeURIComponent(
        first ? `${first.path.join(".")}: ${first.message}` : "Please check the form."
      )}`
    );
  }
  const input = parsed.data;
  const active = formData.get("active") === "on";
  const isNew = input.slug === "";
  const slug = isNew ? slugify(input.name) : input.slug;
  if (!slug) redirect("/admin/services?error=Name+needs+letters+or+numbers");

  const values = {
    name: input.name,
    priceCents: Math.round(input.price * 100),
    kind: input.kind,
    durationMinutes: input.durationMinutes,
    bufferMinutes: input.kind === "remote" ? 0 : input.bufferMinutes,
    sortOrder: input.sortOrder,
    blurb: input.blurb || null,
    includes: input.includes
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 10),
    active,
  };

  if (isNew) {
    const inserted = await db
      .insert(services)
      .values({ slug, ...values })
      .onConflictDoNothing({ target: services.slug })
      .returning({ slug: services.slug });
    if (inserted.length === 0) {
      redirect(
        `/admin/services?error=${encodeURIComponent(`A service with the link name "${slug}" already exists — pick a different name.`)}`
      );
    }
  } else {
    const updated = await db
      .update(services)
      .set(values)
      .where(eq(services.slug, slug))
      .returning({ slug: services.slug });
    if (updated.length === 0) redirect("/admin/services?error=Service+not+found");
  }

  revalidateServicePages();
  redirect(`/admin/services?saved=${encodeURIComponent(slug)}`);
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) redirect("/admin/services?error=Missing+service");

  // Bookings keep a foreign key to the service — history must stay intact.
  const [referenced] = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(eq(bookings.serviceSlug, slug))
    .limit(1);
  if (referenced) {
    redirect(
      `/admin/services?error=${encodeURIComponent(
        'This service has bookings on record, so it can’t be deleted — uncheck "Bookable" to take it off the menu instead.'
      )}`
    );
  }

  // An empty services table makes the site fall back to the built-in seed
  // menu, silently resurrecting the original five services.
  const remaining = await db.select({ slug: services.slug }).from(services).limit(2);
  if (remaining.length <= 1) {
    redirect(
      "/admin/services?error=" +
        encodeURIComponent(
          "You can't delete the last service — the site would fall back to the original built-in menu. Add or edit instead."
        )
    );
  }

  await db.delete(services).where(eq(services.slug, slug));
  revalidateServicePages();
  redirect("/admin/services?deleted=1");
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
