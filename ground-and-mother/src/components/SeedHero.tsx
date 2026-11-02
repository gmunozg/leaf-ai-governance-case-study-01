"use client";

import { useEffect, useRef } from "react";
import { growRoots } from "@/lib/roots";
import { Words } from "./Words";

// Generated once per module; deterministic, so server and client markup match.
const ROOTS = growRoots({ seed: 11, x: 500, y: 384, length: 600, width: 5, maxOrder: 3 });

type Copy = {
  kicker: string;
  title: string[];
  body: string;
  cue: string;
  caption: string;
  stages: string[];
  seedLabel: string;
};

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * The opening scene. A seed rests in dark soil; as the visitor scrolls, it splits, a root
 * system grows (scroll mapped to stroke-dashoffset), a shoot rises and the soil gives way to
 * ivory. Native scrolling is untouched: the stage is sticky inside a tall section.
 * Desktop: the seed leans toward the pointer and a warm light follows it.
 * Touch: dragging moves the light; tapping the seed makes it stir.
 * Reduced motion / no JS: a single static composition with the roots fully grown.
 */
export function SeedHero({ copy }: { copy: Copy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const seedRef = useRef<SVGGElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current, seed = seedRef.current, stage = stageRef.current;
    if (!section || !seed || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    section.classList.add("is-live");

    let raf = 0;
    const set = (k: string, v: number) => section.style.setProperty(k, v.toFixed(4));
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = section.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = clamp(total > 0 ? -r.top / total : 0);
        set("--p", p);
        set("--open", clamp((p - 0.03) / 0.14));
        set("--rp", clamp((p - 0.1) / 0.6));
        set("--shoot", clamp((p - 0.26) / 0.34));
        set("--leaf", clamp((p - 0.46) / 0.2));
        set("--copy", clamp((p - 0.04) / 0.2));
        set("--ivory", clamp((p - 0.7) / 0.2));
        set("--cap", clamp((p - 0.8) / 0.12));
        const stageIdx = Math.min(3, Math.floor(p * 4.2));
        section.dataset.stage = String(stageIdx);
      });
    };

    // Pointer: the seed leans toward the cursor and grows a touch when it comes close.
    let tx = 0, ty = 0, cx = 0, cy = 0, near = 0, cn = 0, loop = 0, running = false;
    const animate = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cn += (near - cn) * 0.08;
      seed.style.setProperty("--tilt", `${(cx * 7).toFixed(2)}deg`);
      seed.style.setProperty("--lift", `${(cy * -4 - cn * 3).toFixed(2)}px`);
      seed.style.setProperty("--near", cn.toFixed(3));
      if (Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(near - cn) > 0.002) loop = requestAnimationFrame(animate);
      else running = false;
    };
    const kick = () => { if (!running) { running = true; loop = requestAnimationFrame(animate); } };
    const aim = (clientX: number, clientY: number) => {
      const s = seed.getBoundingClientRect();
      const sx = s.left + s.width / 2, sy = s.top + s.height / 2;
      const dx = clientX - sx, dy = clientY - sy;
      const dist = Math.hypot(dx, dy);
      tx = Math.max(-1, Math.min(1, dx / 380));
      ty = Math.max(-1, Math.min(1, dy / 380));
      near = clamp(1 - dist / 260);
      const st = stage.getBoundingClientRect();
      stage.style.setProperty("--lx", `${(((clientX - st.left) / st.width) * 100).toFixed(1)}%`);
      stage.style.setProperty("--ly", `${(((clientY - st.top) / st.height) * 100).toFixed(1)}%`);
      kick();
    };
    const onPointer = (e: PointerEvent) => aim(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) aim(t.clientX, t.clientY); };
    const onLeave = () => { tx = 0; ty = 0; near = 0; kick(); };
    const stir = () => {
      seed.classList.remove("is-stirring");
      void seed.getBoundingClientRect();
      seed.classList.add("is-stirring");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    stage.addEventListener("pointermove", onPointer);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("touchmove", onTouch, { passive: true });
    stage.addEventListener("touchstart", onTouch, { passive: true });
    seed.addEventListener("click", stir);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      stage.removeEventListener("pointermove", onPointer);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("touchmove", onTouch);
      stage.removeEventListener("touchstart", onTouch);
      seed.removeEventListener("click", stir);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(loop);
    };
  }, []);

  let wi = 0;
  return (
    <section ref={sectionRef} className="seed-hero" aria-labelledby="hero-title" data-stage="0">
      <div className="seed-hero__sticky">
        <div className="seed-hero__stage" ref={stageRef}>
          <div className="soil" aria-hidden="true" />
          <div className="soil-light" aria-hidden="true" />
          <div className="soil-ivory" aria-hidden="true" />

          <svg className="seed-hero__art" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMin slice" role="img" aria-label={copy.seedLabel}>
            <defs>
              <radialGradient id="seed-shell" cx="0.36" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#a8825a" />
                <stop offset="0.35" stopColor="#7a5636" />
                <stop offset="0.75" stopColor="#4a311c" />
                <stop offset="1" stopColor="#24160b" />
              </radialGradient>
              <filter id="seed-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" /></filter>
              <radialGradient id="seed-sheen" cx="0.36" cy="0.28" r="0.5">
                <stop offset="0" stopColor="#f3dcb4" stopOpacity="0.55" />
                <stop offset="1" stopColor="#f3dcb4" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="seed-inner" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#efe2c4" />
                <stop offset="1" stopColor="#c9b48c" />
              </linearGradient>
              <linearGradient id="leaf-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a7b48a" />
                <stop offset="1" stopColor="#56683f" />
              </linearGradient>
              <radialGradient id="seed-shadow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#000" stopOpacity="0.55" />
                <stop offset="1" stopColor="#000" stopOpacity="0" />
              </radialGradient>
              <filter id="seed-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3" result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0 0.04  0 0 0 0.55 0" result="g" />
                <feComposite in="g" in2="SourceGraphic" operator="in" result="gi" />
                <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="gi" /></feMerge>
              </filter>
            </defs>

            {/* Roots: each segment draws in its own window of root time. */}
            <g className="roots" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {ROOTS.map((r, i) => (
                <path key={i} d={r.d} strokeWidth={r.w} pathLength={1} className={`o${r.o}`} style={{ "--s": r.s, "--t": r.t } as React.CSSProperties} />
              ))}
            </g>

            {/* Shoot and seed leaves */}
            <g className="shoot">
              <path className="shoot__stem" d="M500 286 C499 262 493 236 499 210 C504 188 514 172 510 152" pathLength={1} fill="none" strokeWidth="3.2" strokeLinecap="round" />
              <g className="shoot__leaf shoot__leaf--l"><g transform="translate(510 152) scale(0.72) translate(-510 -152)"><path d="M510 152 C488 150 462 136 452 112 C478 108 502 122 510 152 Z" fill="url(#leaf-fill)" /><path d="M510 152 C494 140 474 126 458 115" fill="none" stroke="#3f4f2c" strokeWidth="0.9" opacity="0.6" /></g></g>
              <g className="shoot__leaf shoot__leaf--r"><g transform="translate(510 152) scale(0.72) translate(-510 -152)"><path d="M510 152 C530 144 552 126 556 100 C530 100 512 120 510 152 Z" fill="url(#leaf-fill)" /><path d="M510 152 C524 136 540 118 552 104" fill="none" stroke="#3f4f2c" strokeWidth="0.9" opacity="0.6" /></g></g>
            </g>

            {/* The seed: shaded coat with fine striations; it cracks rather than blooms. */}
            <g ref={seedRef} className="seed">
              <ellipse cx="502" cy="388" rx="46" ry="9" fill="url(#seed-shadow)" className="seed__shadow" />
              <g className="seed__body">
                <path className="seed__inner" d="M500 288 C516 290 523 314 521 338 C519 360 509 374 500 377 C491 374 481 360 479 338 C477 314 484 290 500 288 Z" fill="url(#seed-inner)" />
                <g className="seed__half seed__half--l">
                  <path d="M500 280 C476 281 465 309 467 338 C469 366 486 383 500 386 Z" fill="url(#seed-shell)" filter="url(#seed-grain)" />
                  <path d="M492 292 C480 312 478 344 488 370 M484 300 C474 322 474 350 482 368" fill="none" stroke="#2a190c" strokeWidth="0.7" opacity="0.35" />
                  <ellipse cx="484" cy="312" rx="5" ry="15" fill="#f6e3c2" opacity="0.28" filter="url(#seed-soft)" />
                </g>
                <g className="seed__half seed__half--r">
                  <path d="M500 280 C524 279 535 308 533 336 C531 364 515 383 500 386 Z" fill="url(#seed-shell)" filter="url(#seed-grain)" />
                  <path d="M510 292 C522 312 524 344 513 370 M518 302 C527 324 527 350 519 367" fill="none" stroke="#2a190c" strokeWidth="0.7" opacity="0.3" />
                </g>
                <path className="seed__rim" d="M500 280 C476 281 465 309 467 338 C469 366 486 383 500 386 C515 383 531 364 533 336 C535 308 524 279 500 280 Z" fill="none" stroke="#1d1108" strokeWidth="1.4" />
                <path d="M497 378 C499 381 502 381 504 378" fill="none" stroke="#d8c09a" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
              </g>
            </g>
          </svg>

          <div className="wrap seed-hero__copy">
            <p className="label seed-hero__kicker">{copy.kicker}</p>
            <h1 id="hero-title" className="mega seed-hero__title">
              {copy.title.map((line, i) => {
                const el = <span key={i} className="line"><Words text={line} start={wi} /></span>;
                wi += line.split(" ").length;
                return el;
              })}
            </h1>
            <p className="lede seed-hero__body">{copy.body}</p>
            <p className="label seed-hero__cue" aria-hidden="true"><span className="cue-line" />{copy.cue}</p>
          </div>

          <ol className="seed-hero__stages label" aria-hidden="true">
            {copy.stages.map((s, i) => <li key={s} data-i={i}>{s}</li>)}
          </ol>

          <p className="seed-hero__caption serif">{copy.caption}</p>
        </div>
      </div>
    </section>
  );
}
