"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Scroll reveals for every [data-reveal] element. One observer for the whole page,
 * re-run on each route change. Elements are only hidden by CSS when JS is active and
 * motion is allowed, so nothing is ever lost for no-JS or reduced-motion visitors.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supported = "IntersectionObserver" in window && "MutationObserver" in window;
    const io = supported && !reduce
      ? new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                e.target.classList.add("is-in");
                io && io.unobserve(e.target);
              }
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
        )
      : null;
    const watch = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => (io ? io.observe(el) : el.classList.add("is-in")));
    };
    watch(document);
    // Pick up elements added later (filtered lists, client navigation).
    const mo = supported
      ? new MutationObserver((records) => {
          for (const r of records) r.addedNodes.forEach((n) => {
            if (!(n instanceof HTMLElement)) return;
            if (n.matches("[data-reveal]:not(.is-in)")) (io ? io.observe(n) : n.classList.add("is-in"));
            watch(n);
          });
        })
      : null;
    mo?.observe(document.body, { childList: true, subtree: true });
    return () => {
      io?.disconnect();
      mo?.disconnect();
    };
  }, [pathname]);
  return null;
}

