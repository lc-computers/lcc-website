import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/posts";
import { CITIES, SERVICES, SITE_URL } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/services", "/service-areas", "/about", "/contact", "/blog"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const cityRoutes = CITIES.map((c) => ({
    url: `${SITE_URL}/service-areas/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const postRoutes = POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...cityRoutes, ...postRoutes];
}
