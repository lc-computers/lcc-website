import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { servicePages } from "@/lib/content/services";
import { areaPages } from "@/lib/content/areas";
import { getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/government`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/home-services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/health-check`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const services: MetadataRoute.Sitemap = servicePages.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const areas: MetadataRoute.Sitemap = areaPages.map((a) => ({
    url: `${site.url}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let posts: MetadataRoute.Sitemap = [];
  try {
    const published = await getPublishedPosts();
    posts = published.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.publishedAt ?? now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable — static pages still ship
  }

  return [...staticPages, ...services, ...areas, ...posts];
}
