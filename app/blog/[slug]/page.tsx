import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd } from "@/lib/jsonld";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const others = (await getPublishedPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <article>
        <header className="border-b border-cream-200 bg-cream-100">
          <Container className="py-14 sm:py-18">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All articles
            </Link>
            <h1 className="mt-5 max-w-3xl font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-500">{post.description}</p>
            {post.publishedAt ? (
              <time
                dateTime={post.publishedAt.toISOString()}
                className="mt-4 block text-sm font-medium text-ink-500"
              >
                {formatDate(post.publishedAt)} · Lake Cumberland Computers
              </time>
            ) : null}
          </Container>
        </header>

        <Container className="py-12 sm:py-16">
          <div className="prose-site max-w-3xl text-base text-ink-700 sm:text-lg">
            <Markdown>{post.contentMd}</Markdown>
          </div>
        </Container>
      </article>

      {others.length > 0 ? (
        <section className="border-t border-cream-200 bg-cream-100 py-14">
          <Container>
            <h2 className="font-serif text-2xl font-semibold text-ink-900">Keep reading</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-lg border border-cream-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
                >
                  <h3 className="font-serif text-lg font-semibold text-ink-900 group-hover:text-navy-700">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-500 line-clamp-3">{p.description}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand
        title="Got a question this didn't answer?"
        lede="Call the shop, use the chat, or book time with a technician — plain answers are the whole business model."
        location="blog_post_cta"
      />

      {post.publishedAt ? (
        <JsonLd
          data={articleJsonLd({
            title: post.title,
            description: post.description,
            slug: post.slug,
            publishedAt: post.publishedAt,
          })}
        />
      ) : null}
    </>
  );
}
