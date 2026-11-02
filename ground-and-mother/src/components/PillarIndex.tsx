"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Tone } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { Media } from "./Media";
import { Arrow } from "./Arrow";

type Row = { href: string; numeral: string; title: string; meta: string; tone: Tone; brief: string };

/**
 * The three chapters as a magazine-style index. On desktop, a photograph floats beside the
 * pointer as you move over each row; on touch devices the image sits inline instead.
 */
export function PillarIndex({ rows, locale, placeholderLabel }: { rows: Row[]; locale: Locale; placeholderLabel: string }) {
  const [active, setActive] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !floatRef.current || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (floatRef.current) floatRef.current.style.transform = `translate3d(${x + 40}px, ${y}px, 0) translate(0, -50%) rotate(${(x / r.width - 0.5) * 6}deg)`;
    });
  };

  return (
    <div className="pindex" ref={wrapRef} onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <div className="pindex__float" ref={floatRef} data-show={active !== null} aria-hidden="true">
        {rows.map((r, i) => (
          <div key={r.href} className="media" data-active={active === i}>
            <div className={`ph ph--${r.tone} ph--compact`}>
              <div className="ph__label"><span className="label">{placeholderLabel}</span></div>
            </div>
          </div>
        ))}
      </div>
      {rows.map((r, i) => (
        <Link key={r.href} href={r.href} className="pindex__row" onPointerEnter={() => setActive(i)} onFocus={() => setActive(null)} data-reveal style={{ "--d": i * 90 } as React.CSSProperties}>
          <span className="pindex__num numeral" aria-hidden="true">{r.numeral}.</span>
          <span className="pindex__title serif">{r.title}</span>
          <span className="pindex__meta muted">{r.meta}</span>
          <span className="pindex__arrow" aria-hidden="true"><Arrow /></span>
          <span className="pindex__mobile-media">
            <Media tone={r.tone} locale={locale} brief={r.brief} placeholderLabel={placeholderLabel} ratio="land" reveal={false} compact />
          </span>
        </Link>
      ))}
    </div>
  );
}
