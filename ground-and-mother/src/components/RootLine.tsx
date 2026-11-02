"use client";

import { useEffect, useRef, useState } from "react";
import { spinePath } from "@/lib/roots";

const SPINE = spinePath(5, 60, 1000);

/**
 * The root that connects the homepage: a single living line in the left margin that grows
 * with the reader's progress through the story. Purely visual (aria-hidden); the botanical
 * notes placed along it are real buttons.
 */
export function RootLine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.setProperty("--g", "1"); return; }
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const g = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / r.height));
        el.style.setProperty("--g", g.toFixed(4));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="rootline" ref={ref}>
      <svg className="rootline__svg" viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="rootline__main" d={SPINE.main} pathLength={1} vectorEffect="non-scaling-stroke" />
        {SPINE.laterals.map((d, i) => (
          <path key={i} className="rootline__lat" d={d} pathLength={1} vectorEffect="non-scaling-stroke" style={{ "--at": (i + 1) / (SPINE.laterals.length + 1) } as React.CSSProperties} />
        ))}
      </svg>
      {children}
    </div>
  );
}

/** A botanical detail on the root line: tap, click or press Enter to read it. */
export function RootNote({ id, label, term, body, closeLabel }: { id: string; label: string; term: string; body: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: PointerEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open]);
  return (
    <div className="root-note" ref={wrap} data-open={open}>
      <button type="button" className="root-note__node" aria-expanded={open} aria-controls={`note-${id}`} aria-label={`${label}: ${term}`} onClick={() => setOpen((o) => !o)}>
        <span className="root-note__dot" aria-hidden="true" />
        <span className="root-note__label label">{label}</span>
        <span className="root-note__term">{term}</span>
      </button>
      <div id={`note-${id}`} className="root-note__panel" role="region" aria-label={`${label}: ${term}`} hidden={!open}>
        <p className="label clay" style={{ margin: 0 }}>{label}</p>
        <p className="h3 serif" style={{ margin: 0 }}>{term}</p>
        <p style={{ margin: 0 }}>{body}</p>
        <button type="button" className="text-link root-note__close" onClick={() => setOpen(false)}>{closeLabel}</button>
      </div>
    </div>
  );
}
