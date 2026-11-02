"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";
import { tableObjects } from "@/content/table";
import { mountTable } from "@/lib/table";

/**
 * The overhead table. Decorative to assistive tech (the story is told in the text panels).
 * Each object shows its photograph when one exists, otherwise a labelled marker in its exact place.
 */
export function TableStage({ locale, planLabel }: { locale: Locale; planLabel: string }) {
  useEffect(() => mountTable(), []);
  return (
    <div className="tb-stage" aria-hidden="true">
      <div className="tb-plane">
        <div className="tb-surface" />
        {tableObjects.map((o) => (
          <div
            key={o.id}
            className={`tb-obj tb-obj--${o.shape}`}
            data-scene={o.scene}
            data-kind={o.kind}
            data-id={o.id}
            data-portrait={`${o.portrait.x},${o.portrait.y}`}
            data-landscape={`${o.landscape.x},${o.landscape.y}`}
            style={{
              zIndex: o.z,
              "--px": `${o.portrait.x}px`, "--py": `${o.portrait.y}px`, "--pw": `${o.portrait.w}px`, "--ph": `${o.portrait.h}px`, "--pr": `${o.portrait.r}deg`,
              "--lx": `${o.landscape.x}px`, "--ly": `${o.landscape.y}px`, "--lw": `${o.landscape.w}px`, "--lh": `${o.landscape.h}px`, "--lr": `${o.landscape.r}deg`,
            } as React.CSSProperties}
          >
            <span className="tb-shadow" />
            <span className="tb-body">
              {o.image ? (
                <img src={o.image.src} alt="" width={o.image.width} height={o.image.height} decoding="async" />
              ) : (
                <span className="tb-label">{o.label[locale]}</span>
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="tb-light" />
      {tableObjects.some((o) => !o.image) ? <p className="tb-plan label">{planLabel}</p> : null}
    </div>
  );
}
