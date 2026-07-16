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
  const line2 = variant === "dark" ? "text-brass-600" : "text-brass-300";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className={`h-9 w-9 shrink-0 ${markColor}`} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-lg font-semibold leading-none tracking-tight ${line1}`}>
          Lake Cumberland
        </span>
        <span
          className={`mt-1 font-sans text-[0.6rem] font-bold uppercase leading-none ${line2}`}
          style={{ letterSpacing: "0.34em" }}
        >
          Computers
        </span>
      </span>
    </span>
  );
}
