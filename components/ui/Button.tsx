import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "onNavy" | "brass";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-sans text-sm font-semibold transition-colors duration-150";

const variants: Record<Variant, string> = {
  primary: "bg-navy-700 text-cream-50 hover:bg-navy-800",
  secondary:
    "border border-navy-300 bg-transparent text-navy-800 hover:border-navy-700 hover:bg-navy-50",
  onNavy: "bg-cream-50 text-navy-900 hover:bg-cream-100",
  brass: "bg-brass-500 text-navy-950 hover:bg-brass-400",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function buttonClasses(variant: Variant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}
