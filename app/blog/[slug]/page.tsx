import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { getPost, POSTS } from "@/lib/posts";
import { BUSINESS, getService, SITE_URL } from "@/lib/site-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      title: post.title,
      description: post.description,
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const service = getService(post.serviceSlug);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
      author: { "@type": "Organization", name: BUSINESS.name },
      publisher: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `${SITE_URL}/blog/${post.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={schema} />
      <article className="mx-auto max-w-3xl px-4 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400">
                Home
              </Link>
              <span aria-hidden="true"> / </span>
            </li>
            <li>
              <Link href="/blog" className="hover:text-sky-600 dark:hover:text-sky-400">
                Blog
              </Link>
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
          {" · "}
          {BUSINESS.name}
        </p>

        {post.body}

        {service && (
          <aside className="mt-12 rounded-lg bg-slate-50 p-6 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Need help with this?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              We handle {service.name.toLowerCase()} for businesses and homes across the Lake
              Cumberland region.{" "}
              <Link
                href={`/services/${service.slug}`}
                className="font-medium text-sky-600 hover:underline dark:text-sky-400"
              >
                Learn about our {service.title.toLowerCase()}
              </Link>{" "}
              or call{" "}
              <a
                href={BUSINESS.phoneHref}
                className="font-medium text-sky-600 hover:underline dark:text-sky-400"
              >
                {BUSINESS.phone}
              </a>
              .
            </p>
          </aside>
        )}
      </article>
      <Cta />
    </>
  );
}
