import { Mark } from "./Mark";

/**
 * Typographic wordmark lockup: mark + two-line company name.
 * `dark` = navy on light backgrounds (header); `light` = cream on navy (footer).
 * Rendered as real text for accessibility and crisp font rendering; standalone
 * SVG versions live in /public/brand for use outside the site.
 */
export function Wordmark({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const markColor = variant === "dark" ? "text-navy-700" : "text-cream-50";
  const line1 = variant === "dark" ? "text-navy-900" : "text-cream-50";
  const line2 = variant === "dark" ? "text-brass-700" : "text-brass-300";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className={`h-9 w-9 shrink-0 ${markColor}`} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-lg font-semibold leading-none tracking-tight ${line1}`}>
          Lake Cumberland
        </span>
        {/* Width-matched to "Lake Cumberland" (147.8px @ 18px): 13px ×
            (6.40em glyphs + 8 × 0.621em gaps) ≈ 147.8. The negative
            margin-right cancels the trailing letter-space so the S sits
            flush right. Brand rule: below ~28px lockup height, drop this
            line entirely — never render it smaller than this ratio. */}
        <span
          className={`mt-[5px] font-sans text-[0.8125rem] font-bold uppercase leading-none ${line2}`}
          style={{ letterSpacing: "0.621em", marginRight: "-0.621em" }}
        >
          Computers
        </span>
      </span>
    </span>
  );
}
