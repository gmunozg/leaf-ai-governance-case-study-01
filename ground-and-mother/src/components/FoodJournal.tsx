"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { FoodEntry } from "@/content/foods";
import type { Image as Img, Tone } from "@/content/products";
import type { Motif } from "./StillLife";
import { Media } from "./Media";

export type FoodItem = { id: string; tone: Tone; motif: Motif; image: Img | null; c: FoodEntry };
type Labels = {
  plate: string; open: string; close: string; prev: string; next: string;
  nutrition: string; tradition: string; kitchen: string; tryThis: string; note: string;
  disclaimer: string; sources: string; of: string;
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const RATIOS = ["tall", "square", "portrait", "square", "land", "portrait", "tall", "square"] as const;

/**
 * An editorial food journal: plates laid out asymmetrically. Each plate is a button that opens
 * a modal <dialog> entry (Escape closes, arrow keys move between entries, swipe on touch).
 * Names and one-line descriptions are always visible — nothing essential sits behind hover.
 */
export function FoodJournal({ items, labels, sources, locale, placeholderLabel }: { items: FoodItem[]; labels: Labels; sources: { label: string; url: string }[]; locale: Locale; placeholderLabel: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    const d = dialogRef.current;
    if (d && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  };
  const close = useCallback(() => dialogRef.current?.close(), []);
  const go = useCallback((dir: number) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      setIndex((i) => {
        if (i !== null) triggers.current[i]?.focus({ preventScroll: true });
        return null;
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    };
    const onClick = (e: MouseEvent) => { if (e.target === d) close(); };
    d.addEventListener("close", onClose);
    d.addEventListener("keydown", onKey);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("keydown", onKey);
      d.removeEventListener("click", onClick);
    };
  }, [go, close]);

  return (
    <>
      <ul className="fj-grid">
        {items.map((it, i) => (
          <li key={it.id} className="fj-cell" data-i={i}>
            <button
              ref={(el) => { triggers.current[i] = el; }}
              type="button"
              className="fj-item"
              aria-haspopup="dialog"
              onClick={() => open(i)}
            >
              <Media image={it.image} tone={it.tone} motif={it.motif} locale={locale} brief={it.c.brief} placeholderLabel={placeholderLabel} ratio={RATIOS[i % RATIOS.length]} delay={(i % 3) * 90} compact decorative sizes="(min-width: 1024px) 34vw, 50vw" />
              <span className="fj-cap">
                <span className="label clay">{labels.plate} {ROMAN[i]}</span>
                <span className="fj-name serif">{it.c.name}</span>
                <span className="fj-line muted">{it.c.line}</span>
                <span className="fj-open label" aria-hidden="true"><span className="fj-plus" />{labels.open}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="fj-dialog"
        aria-labelledby={index === null ? undefined : `fj-title-${index}`}
        onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
        onTouchEnd={(e) => {
          const start = touchX.current; touchX.current = null;
          const end = e.changedTouches[0]?.clientX;
          if (start == null || end == null) return;
          if (Math.abs(end - start) > 60) go(end < start ? 1 : -1);
        }}
      >
        {/* Every entry is in the HTML (readable without JS and by search engines); only the selected one is shown. */}
        {items.map((it, i) => (
          <article className="fj-entry" key={it.id} data-entry={i} hidden={index !== i} aria-labelledby={`fj-title-${i}`}>
            <div className="fj-entry__media">
              <Media image={it.image} tone={it.tone} motif={it.motif} locale={locale} brief={it.c.brief} placeholderLabel={placeholderLabel} ratio="portrait" reveal={false} sizes="(min-width: 900px) 40vw, 100vw" />
            </div>
            <div className="fj-entry__text">
              <div className="fj-entry__bar">
                <span className="label clay">{labels.plate} {ROMAN[i]} <span className="muted">{labels.of} {ROMAN[items.length - 1]}</span></span>
                <button type="button" className="fj-close" onClick={close} aria-label={labels.close}><span aria-hidden="true" /></button>
              </div>
              <h2 id={`fj-title-${i}`} className="display fj-title">{it.c.name}</h2>
              <p className="lede">{it.c.line}</p>
              <dl className="fj-facts">
                <div><dt className="label">{labels.nutrition}</dt><dd>{it.c.nutrition}</dd></div>
                <div><dt className="label">{labels.tradition}</dt><dd>{it.c.tradition}</dd></div>
                <div><dt className="label">{labels.kitchen}</dt><dd>{it.c.kitchen}</dd></div>
                <div><dt className="label">{labels.tryThis}</dt><dd className="serif fj-try">{it.c.tryThis}</dd></div>
              </dl>
              {it.c.note ? <p className="fj-note"><strong className="label">{labels.note}</strong> {it.c.note}</p> : null}
              <div className="fj-foot">
                <p className="buybox__note">{labels.disclaimer}</p>
                <details className="fj-sources">
                  <summary className="label">{labels.sources}</summary>
                  <ul>{sources.map((s) => <li key={s.url}><a className="ul" href={s.url} target="_blank" rel="noopener">{s.label}</a></li>)}</ul>
                </details>
                <div className="fj-nav">
                  <button type="button" className="btn btn--ghost fj-prev" onClick={() => go(-1)}><span aria-hidden="true">←</span><span>{labels.prev}</span></button>
                  <button type="button" className="btn fj-next" onClick={() => go(1)}><span>{labels.next}</span><span aria-hidden="true">→</span></button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </dialog>
    </>
  );
}
