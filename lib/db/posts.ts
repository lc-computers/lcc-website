import { desc, eq } from "drizzle-orm";
import { getDb } from "./index";
import { posts } from "./schema";
import type { BlogPost } from "@/lib/blog";

export async function getPublishedDbPosts(): Promise<BlogPost[]> {
  const db = getDb();
  const rows = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      description: posts.description,
      contentMd: posts.contentMd,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));
  return rows;
}
