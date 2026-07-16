<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Known Next 16 gotchas already confirmed against the bundled docs: `params` is a Promise (must `await`), `next/image` uses `preload` not `priority`, JSON-LD goes in a sanitized inline `<script>`, `next lint` no longer exists.

# Business

Lake Cumberland Computers — local MSP/IT services company in Russell Springs, KY serving the Lake Cumberland region. Canonical business facts (NAP, hours, services, service area) live in `reference/business-info.md` and in code in `lib/site-data.ts`. NAP must stay identical everywhere it appears (header, footer, contact page, JSON-LD).

Canonical domain: `https://lakecumberlandcomputers.com`

# Site Structure

| Route | Page |
|---|---|
| `/` | Home — hero, services grid, service-area strip, trust points, CTA |
| `/services` | Services index |
| `/services/[slug]` | 7 service pages: managed-it, networking, cybersecurity, wifi, security-cameras, phone-systems, computer-repair |
| `/service-areas` | Service area index |
| `/service-areas/[city]` | 9 city pages: somerset, russell-springs, jamestown, liberty, columbia, albany, greensburg, burkesville, monticello |
| `/about` | About the company |
| `/contact` | Contact — NAP, hours, tel/mailto links |

All content for service and city pages is data-driven from `lib/site-data.ts` — one source of truth for pages, nav, footer, schema, and sitemap. City pages must have unique copy (thin duplicate content hurts local SEO).

# Local SEO requirements

1. NAP consistency everywhere; `tel:`/`mailto:` links.
2. LocalBusiness JSON-LD in root layout (address, geo, phone, openingHoursSpecification, areaServed).
3. Service + BreadcrumbList schema on service pages; BreadcrumbList on city pages.
4. Unique title/description per page; canonicals via `metadataBase` + `alternates.canonical`.
5. `app/sitemap.ts` + `app/robots.ts`.
6. Semantic HTML: one `<h1>` per page, landmark elements, descriptive internal links between service and city pages.
7. Every page statically generated (no `searchParams`/`cookies()`/`headers()` in pages).

# Phases

- **Phase 1 (done):** all pages above + local SEO foundations.
- **Phase 2 (done, pending owner inputs):** brand OG image + icon, testimonials infrastructure (`TESTIMONIALS` in `lib/site-data.ts` — renders only when populated with REAL quotes; never invent them), Google Business Profile hooks (`GOOGLE_BUSINESS_PROFILE_URL` — set to enable review buttons + sameAs schema), Google Maps embed on contact, Vercel Analytics. Still owner-supplied: real photography, real testimonial quotes, GBP URL.
- **Phase 3 (done):** blog at `/blog` — posts live in `lib/posts.tsx` (JSX bodies, BlogPosting + BreadcrumbList schema, in sitemap). Add new posts there.
