"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Sprig } from "./Sprig";

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

/**
 * The botanical cursor: a small sprig that trails the pointer, sways with movement and
 * opens its leaves over interactive elements. Desktop pointers only; the native cursor is kept.
 */
export function SprigCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches || !ref.current) return;
    const el = ref.current;
    let x = -100, y = -100, tx = -100, ty = -100, rot = 0, raf = 0, running = false;

    const tick = () => {
      const dx = tx - x;
      const dy = ty - y;
      x += dx * 0.16;
      y += dy * 0.16;
      // Sway: lean into horizontal movement, settle back to upright.
      const targetRot = Math.max(-28, Math.min(28, dx * 0.9));
      rot += (targetRot - rot) * 0.12;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
      if (Math.abs(dx) + Math.abs(dy) + Math.abs(rot) > 0.15) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (x < -50) { x = tx; y = ty; }
      el.dataset.visible = "true";
      const t = e.target as Element | null;
      el.dataset.active = String(Boolean(t?.closest?.("a, button, summary, input, [data-cursor]")));
      el.dataset.dark = String(Boolean(t?.closest?.(".on-dark")));
      start();
    };
    const onLeave = () => { el.dataset.visible = "false"; };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className="sprig-cursor" aria-hidden="true">
      <Sprig strokeWidth={1.4} />
    </div>
  );
}
