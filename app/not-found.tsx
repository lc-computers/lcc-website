import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start px-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-sky-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-sky-700"
      >
        Back to Home
      </Link>
    </section>
  );
}
