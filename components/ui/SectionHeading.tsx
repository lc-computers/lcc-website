import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  onNavy = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  align?: "left" | "center";
  onNavy?: boolean;
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      {eyebrow ? (
        <p className={onNavy ? "eyebrow-light" : "eyebrow"}>{eyebrow}</p>
      ) : null}
      <h2
        className={`mt-3 font-serif text-3xl font-semibold sm:text-4xl ${
          onNavy ? "text-cream-50" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {lede ? (
        <p className={`mt-4 text-lg ${onNavy ? "text-navy-100" : "text-ink-500"}`}>{lede}</p>
      ) : null}
    </div>
  );
}
