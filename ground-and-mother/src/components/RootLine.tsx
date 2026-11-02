"use client";

import { useEffect, useRef, useState } from "react";

/** Wraps the homepage story; the botanical plate (BotanicalPlate) draws the continuous root. */
export function RootLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="rootline">
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
