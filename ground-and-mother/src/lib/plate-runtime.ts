/**
 * Mounts the botanical plate on the home page. Framework-free so the same code runs in the
 * Next.js site and in the static preview. Measures the page, builds the plate, keeps it in
 * sync with layout changes and draws it as the visitor scrolls (growth never reverses).
 */
import { buildPlate, type R } from "./plate";

const TEXT = [
  "main h1", "main h2", "main h3", "main p", "main .btn", "main .text-link", "main .label", "main .chips",
  "main .fj-cap", "main .pcard__type", "main .pcard__foot", "main .lib-item", "main .pindex__title",
  "main .pindex__meta", "main .pindex__num", "main dl", "main form", "main .applist", "main .marquee",
  "main .crumbs", "main .root-note__node", "main .pill", "main .kicker-row", "main .cycle__num",
  ".site-footer .footer-cols a", ".site-footer .footer-cols h2", ".site-footer .footer-cols p", ".site-footer .footer-legal p",
].join(",");

export function mountPlate(): () => void {
  const hero = document.querySelector<HTMLElement>(".seed-hero");
  const host = document.createElement("div");
  host.className = "plate";
  host.setAttribute("aria-hidden", "true");
  document.body.appendChild(host);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let top = 0, bands: { el: SVGGElement; b: number; done: boolean }[] = [], lastKey = "", raf = 0, timer = 0;

  const docY = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

  // Where the hero's taproot leaves the opening scene (in page x), and how thick it is there.
  const heroExit = () => {
    const fallback = { x: document.documentElement.clientWidth * (window.innerWidth >= 1024 ? 0.67 : 0.5), w: 3 };
    const stage = hero?.querySelector(".seed-hero__stage");
    const paths = hero ? Array.from(hero.querySelectorAll<SVGPathElement>(".roots path.o0")) : [];
    if (!stage || !paths.length) return fallback;
    const st = stage.getBoundingClientRect();
    let best: { x: number; w: number; dy: number } | null = null;
    for (const p of paths) {
      const ctm = p.getScreenCTM();
      if (!ctm) continue;
      const len = p.getTotalLength();
      for (let l = 0; l <= len; l += len / 40) {
        const pt = p.getPointAtLength(l);
        const sx = ctm.a * pt.x + ctm.c * pt.y + ctm.e;
        const sy = ctm.b * pt.x + ctm.d * pt.y + ctm.f;
        const dy = Math.abs(sy - st.top - st.height);
        if (!best || dy < best.dy) best = { x: sx - st.left, w: parseFloat(p.getAttribute("stroke-width") || "3") * ctm.a, dy };
      }
    }
    return best && best.dy < st.height * 0.25 ? { x: best.x, w: best.w } : fallback;
  };

  const build = () => {
    const W = document.documentElement.clientWidth;
    top = hero ? docY(hero) + hero.offsetHeight : 0;
    const H = Math.max(0, document.documentElement.scrollHeight - top);
    const key = `${W}x${H}`;
    if (key === lastKey || H < 200) return;
    lastKey = key;
    // Elements still waiting for their scroll reveal are drawn 28px low (see [data-reveal] in CSS);
    // measure where they will settle, not where they are mid-animation.
    const motion = !reduce && document.documentElement.classList.contains("js");
    const pending = '[data-reveal]:not(.is-in):not([data-reveal="image"]):not([data-reveal="words"]):not([data-reveal="draw"]):not([data-reveal="rule"])';
    const rel = (el: Element): R | null => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      const shift = motion && el.closest(pending) ? 28 : 0;
      const y = r.top + window.scrollY - top - shift;
      if (y + r.height < 0) return null;
      return { x: r.left, y, w: r.width, h: r.height };
    };
    const pick = (sel: string) => Array.from(document.querySelectorAll(sel)).filter((el) => !el.closest(".seed-hero, dialog, #mobile-menu")).map(rel).filter((r): r is R => !!r);
    const sec = (sel: string) => { const el = document.querySelector(sel); return el ? rel(el) ?? undefined : undefined; };
    const footerEl = document.querySelector(".site-footer");
    const exit = heroExit();
    const mobile = W < 768;
    host.style.top = `${top}px`;
    host.style.height = `${H}px`;
    const tiles = buildPlate({
      W, H, mobile,
      startX: exit.x, startW: exit.w,
      text: pick(TEXT),
      media: pick("main .media"),
      dark: pick("main .on-dark, .site-footer"),
      footer: footerEl ? rel(footerEl) : null,
      sections: {
        statement: sec(".rootline > section:first-of-type"),
        food: sec(".fj"),
        chapters: sec('section[aria-labelledby="pillars-title"]'),
        library: sec('section[aria-labelledby="lib-title"]'),
      },
      gEnd: H - window.innerHeight * 0.18,
    });
    host.innerHTML = tiles
      .map((t) => `<svg class="plate__tile" focusable="false" style="top:${t.y}px;height:${t.h}px" width="${W}" height="${t.h}" viewBox="0 ${t.y} ${W} ${t.h}">${t.svg}</svg>`)
      .join("");
    bands = Array.from(host.querySelectorAll<SVGGElement>(".pb")).map((el) => ({ el, b: Number(el.dataset.b), done: false }));
    update();
  };

  const update = () => {
    const g = reduce ? 1e9 : window.scrollY + window.innerHeight * 0.82 - top;
    for (const band of bands) {
      if (band.done || band.b > g + 50) continue;
      band.el.style.setProperty("--g", g.toFixed(1));
      if (band.b + 2400 < g || reduce) { band.el.style.setProperty("--g", "1e9"); band.done = true; }
    }
  };
  const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
  const schedule = () => { window.clearTimeout(timer); timer = window.setTimeout(build, 250); };

  // Wait for the page-entry animation to settle so measurements are exact.
  const entering = document.querySelector(".page-enter")?.getAnimations?.() ?? [];
  Promise.all(entering.map((a) => a.finished.catch(() => undefined))).then(() => { lastKey = ""; build(); });
  document.fonts?.ready.then(() => { lastKey = ""; build(); });
  const ro = new ResizeObserver(schedule);
  ro.observe(document.body);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", () => { lastKey = ""; build(); });

  return () => {
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(raf);
    window.clearTimeout(timer);
    host.remove();
  };
}
