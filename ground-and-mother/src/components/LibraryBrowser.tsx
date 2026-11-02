"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Tone } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { Media } from "./Media";

export type LibItem = {
  slug: string;
  href: string;
  title: string;
  standfirst: string;
  category: string;
  categoryLabel: string;
  status: "published" | "in-preparation";
  meta: string;
  tone: Tone;
};

type Labels = { search: string; searchPlaceholder: string; all: string; filterLabel: string; noResults: string; inPreparation: string; results: string[] };

/** Search and category filtering for the Library. Works on the pre-rendered list; links stay crawlable. */
export function LibraryBrowser({ items, categories, labels, locale, placeholderLabel }: { items: LibItem[]; categories: { id: string; label: string }[]; labels: Labels; locale: Locale; placeholderLabel: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase(locale);
    return items.filter((it) => {
      if (cat !== "all" && it.category !== cat) return false;
      if (!needle) return true;
      return `${it.title} ${it.standfirst} ${it.categoryLabel}`.toLocaleLowerCase(locale).includes(needle);
    });
  }, [items, q, cat, locale]);

  return (
    <div>
      <div className="lib-tools">
        <div className="search">
          <label htmlFor="lib-search" className="sr-only">{labels.search}</label>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input id="lib-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.searchPlaceholder} autoComplete="off" />
        </div>
        <div className="chips" role="group" aria-label={labels.filterLabel}>
          {[{ id: "all", label: labels.all }, ...categories].map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>
          ))}
        </div>
        <p className="label muted" aria-live="polite" style={{ margin: 0 }}>{labels.results[filtered.length] ?? labels.results[labels.results.length - 1].replace("#", String(filtered.length))}</p>
      </div>

      {filtered.length === 0 ? (
        <p className="lede muted">{labels.noResults}</p>
      ) : (
        <ul className="lib-list">
          {filtered.map((it) => (
            <li key={it.slug} className={`lib-item${it.status === "in-preparation" ? " lib-item--prep" : ""}`}>
              <div className="lib-item__thumb">
                <Media tone={it.tone} locale={locale} placeholderLabel={placeholderLabel} ratio="square" reveal={false} compact />
              </div>
              <div className="stack-sm">
                <div className="lib-item__meta">
                  <span className="label clay">{it.categoryLabel}</span>
                  {it.status === "in-preparation" ? <span className="pill pill--soon">{labels.inPreparation}</span> : null}
                </div>
                <h3 className="lib-item__title serif">
                  <Link href={it.href}><span className="ul-in">{it.title}</span></Link>
                </h3>
                <p className="muted" style={{ margin: 0, maxWidth: "60ch" }}>{it.standfirst}</p>
              </div>
              <p className="label muted" style={{ margin: 0 }}>{it.meta}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
