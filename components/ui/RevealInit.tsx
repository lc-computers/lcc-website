"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One observer for every [data-reveal] element on the page — mounted once in
 * the root layout instead of hydrating a client boundary per revealed card.
 */
export function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    if (elements.length === 0) return;
    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
