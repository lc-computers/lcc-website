import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/sections/CtaBand";
import { getPublishedPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog — Plain-English IT for Kentucky Offices & Homes",
  description:
    "Practical, plain-English articles on security, Microsoft 365, and everyday technology for the offices and homes of south-central Kentucky.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="border-b border-cream-200 bg-cream-100">
        <Container className="py-14 sm:py-18">
          <p className="eyebrow">The blog</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-ink-900 sm:text-5xl">
            Plain-English IT, written for our neighbors.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-500">
            No jargon, no fear-mongering — just what local offices and households actually need
            to know about their technology.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          {featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-lg border border-cream-200 bg-white p-7 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0 sm:p-10"
            >
              <p className="eyebrow">Latest</p>
              <h2 className="mt-3 max-w-3xl font-serif text-2xl font-semibold text-ink-900 group-hover:text-navy-700 sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl text-base text-ink-500">{featured.description}</p>
              <div className="mt-5 flex items-center gap-4 text-sm">
                {featured.publishedAt ? (
                  <time dateTime={featured.publishedAt.toISOString()} className="text-ink-500">
                    {formatDate(featured.publishedAt)}
                  </time>
                ) : null}
                <span className="inline-flex items-center gap-1.5 font-semibold text-navy-700">
                  Read the article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ) : null}

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-lg border border-cream-200 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
              >
                {post.publishedAt ? (
                  <time dateTime={post.publishedAt.toISOString()} className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    {formatDate(post.publishedAt)}
                  </time>
                ) : null}
                <h2 className="mt-2 font-serif text-xl font-semibold text-ink-900 group-hover:text-navy-700">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-ink-500">{post.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700">
                  Read
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Reading about it is step one."
        lede="Step two is fifteen seconds: run your organization's domain through the free security health check and see your grades."
        cta={
          <Link
            href="/health-check"
            className="inline-flex items-center justify-center rounded-md bg-cream-50 px-6 py-3 font-sans text-sm font-semibold text-navy-900 transition-colors hover:bg-cream-100"
          >
            Run the free health check
          </Link>
        }
        location="blog_index_cta"
      />
    </>
  );
}
