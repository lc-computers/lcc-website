import { launchArticles } from "@/lib/content/articles";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  contentMd: string;
  publishedAt: Date | null;
}

function launchPosts(): BlogPost[] {
  return launchArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    contentMd: a.contentMd,
    publishedAt: new Date(`${a.publishedAt}T12:00:00Z`),
  }));
}

/**
 * Published posts, newest first. Reads the posts table when a database is
 * configured; the launch articles are the no-database fallback (they are also
 * seeded into the table, deduped by slug here).
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const fallback = launchPosts();
  if (!process.env.DATABASE_URL) {
    return sortPosts(fallback);
  }
  try {
    const { getPublishedDbPosts } = await import("@/lib/db/posts");
    const dbPosts = await getPublishedDbPosts();
    const bySlug = new Map<string, BlogPost>();
    for (const p of fallback) bySlug.set(p.slug, p);
    for (const p of dbPosts) bySlug.set(p.slug, p);
    return sortPosts([...bySlug.values()]);
  } catch (err) {
    console.error("blog: falling back to launch articles:", err);
    return sortPosts(fallback);
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug);
}

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return posts.sort(
    (a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0)
  );
}
