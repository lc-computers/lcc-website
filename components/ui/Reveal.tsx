import type { ReactNode } from "react";

/**
 * Subtle scroll reveal — a zero-JS server component. The single RevealInit
 * observer in the root layout toggles `.is-visible`; CSS handles the
 * transition, disables movement under prefers-reduced-motion, and only hides
 * content when JS is actually running (html.js). Content is always visible
 * without JavaScript.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      data-reveal
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
