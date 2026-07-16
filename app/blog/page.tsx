import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import { sortedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Tech Tips & Straight Answers",
  description:
    "Practical technology advice for businesses and homes in the Lake Cumberland region of Kentucky — from the team at Lake Cumberland Computers.",
  alternates: { canonical: "/blog" },
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function BlogIndexPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tech Tips & Straight Answers
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Practical advice from our shop in Russell Springs — written for real businesses and
          households in the Lake Cumberland region, not IT departments.
        </p>
        <div className="mt-10 space-y-6">
          {sortedPosts().map((post) => (
            <article
              key={post.slug}
              className="rounded-lg border border-slate-200 p-6 transition-colors hover:border-sky-400 dark:border-slate-800 dark:hover:border-sky-600"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-sky-700 dark:hover:text-sky-400"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{post.description}</p>
              <p className="mt-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-sky-600 dark:text-sky-400"
                >
                  Read article →
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
