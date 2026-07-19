import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // 301 redirects for legacy WordPress URLs that Google still has indexed.
  // Each source points DIRECTLY at a live final URL (no redirect chains).
  // Next.js matches trailing-slash variants automatically, so `/home` also
  // covers `/home/`. Add new entries here as Google Search Console surfaces
  // more 404s from the old site.
  async redirects() {
    return [
      // --- Confirmed dead URLs from the previous WordPress site ---
      { source: "/home", destination: "/", permanent: true },
      { source: "/shop", destination: "/services", permanent: true },

      // --- Common WordPress "about"/"contact" slugs (+ .html variants) ---
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/about-us.html", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/contact-us.html", destination: "/contact", permanent: true },

      // --- Default WordPress/PHP index files ---
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },

      // --- Legacy static services page ---
      { source: "/services.html", destination: "/services", permanent: true },

      // --- Legacy per-service WordPress pages (from Search Console) ---
      {
        source: "/managed-it-services",
        destination: "/services/managed-it",
        permanent: true,
      },

      // --- Old WP theme demo pages (found via Google/DDG site: searches,
      //     July 2026). Numbered slugs (-01, service-two) are theme demo
      //     leftovers; siblings included preemptively. ---
      { source: "/pricing-plans", destination: "/home-services", permanent: true },
      { source: "/pricing-plan-01", destination: "/home-services", permanent: true },
      { source: "/pricing-plan-02", destination: "/home-services", permanent: true },
      { source: "/service-details", destination: "/services", permanent: true },
      { source: "/service-one", destination: "/services", permanent: true },
      { source: "/service-two", destination: "/services", permanent: true },
      { source: "/service-three", destination: "/services", permanent: true },
      { source: "/it-service", destination: "/services", permanent: true },
      { source: "/it-service-details", destination: "/services", permanent: true },
      { source: "/about-01", destination: "/about", permanent: true },
      { source: "/about-02", destination: "/about", permanent: true },
      { source: "/why-choose-us", destination: "/about", permanent: true },
      { source: "/creative-digital-agency", destination: "/services", permanent: true },
      { source: "/seo", destination: "/services", permanent: true },

      // Old WP theme custom post types (em_* prefixes) — portfolio/demo
      // content with no equivalent on the new site.
      { source: "/em_service/:slug*", destination: "/services", permanent: true },
      { source: "/em_case_study/:slug*", destination: "/services", permanent: true },
      { source: "/em_brand/:slug*", destination: "/", permanent: true },
      { source: "/em_portfolio/:slug*", destination: "/", permanent: true },

      // --- Pre-WordPress "Smart Fix" static site (.html pages) ---
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },

      // NOTE: A blanket `/blog/:slug*` -> `/blog` redirect is intentionally
      // OMITTED. The current app serves live posts from `app/blog/[slug]`, so
      // such a rule would shadow every real blog post. Old post URLs that no
      // longer exist simply 404; map specific ones by exact slug here if
      // Search Console reports them, e.g.:
      //   { source: "/blog/old-post-slug", destination: "/blog", permanent: true },

      // --- WordPress category / tag / date-archive patterns -> blog index ---
      // None of these collide with real routes (no top-level numeric or
      // /category, /tag routes exist in the app).
      { source: "/category/:slug*", destination: "/blog", permanent: true },
      { source: "/tag/:slug*", destination: "/blog", permanent: true },
      // Date-based permalinks: /2023/05, /2023/05/post-name, etc.
      {
        source: "/:year(\\d{4})/:month/:slug*",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
