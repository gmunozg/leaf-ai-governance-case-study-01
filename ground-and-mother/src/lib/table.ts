/**
 * The evolving table: scroll-linked placement of objects on one overhead table.
 * The camera only ever looks straight down; it pans and changes distance, never angle.
 * Framework-free so the static preview runs the same code.
 */
import { COMPOSITION, cameras, scenes, type SceneId } from "@/content/table";

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Obj = { el: HTMLElement; scene: number; order: number; count: number; ex: number; ey: number };

export function mountTable(): () => void {
  const root = document.querySelector<HTMLElement>("[data-table]");
  if (!root) return () => {};
  const stage = root.querySelector<HTMLElement>(".tb-stage")!;
  const plane = root.querySelector<HTMLElement>(".tb-plane")!;
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-tb-scene]"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const portraitQ = window.matchMedia("(max-width: 899px)");
  let objs: Obj[] = [];
  let layout: "portrait" | "landscape" = "portrait";
  let anchors: number[] = [];
  let vw = 0, vh = 0, raf = 0, intro = reduce ? 1 : 0;

  const read = () => {
    layout = portraitQ.matches ? "portrait" : "landscape";
    root.classList.toggle("is-portrait", layout === "portrait");
    root.classList.toggle("is-landscape", layout === "landscape");
    const C = COMPOSITION[layout];
    plane.style.width = `${C.w}px`;
    plane.style.height = `${C.h}px`;
    const els = Array.from(plane.querySelectorAll<HTMLElement>(".tb-obj"));
    const counts = new Map<number, number>();
    objs = els.map((el) => {
      const scene = scenes.indexOf(el.dataset.scene as SceneId);
      const order = counts.get(scene) ?? 0;
      counts.set(scene, order + 1);
      const [x, y] = (el.dataset[layout] || "0,0").split(",").map(Number);
      // Each object is placed from the nearer edge of the table, as if set down by a hand.
      const dx = x - C.w / 2, dy = y - C.h / 2, len = Math.hypot(dx, dy) || 1;
      const reach = el.dataset.kind === "hands" ? 360 : 230;
      return { el, scene, order, count: 0, ex: (dx / len) * reach, ey: (dy / len) * reach };
    });
    for (const o of objs) {
      o.count = counts.get(o.scene) ?? 1;
      o.el.style.setProperty("--ex", `${o.ex.toFixed(0)}px`);
      o.el.style.setProperty("--ey", `${o.ey.toFixed(0)}px`);
    }
  };

  const measure = () => {
    vw = document.documentElement.clientWidth;
    vh = window.innerHeight;
    read();
    const sy = window.scrollY;
    // Scene k is fully laid when its panel is well into view; the hero is laid at the very top.
    anchors = panels.map((p, k) => (k === 0 ? 0 : Math.max(1, p.getBoundingClientRect().top + sy - vh * 0.62)));
    root.classList.add("is-live");
    update();
  };

  /** Scroll position → continuous scene index (0 = hero … 5 = final). */
  const sceneT = (s: number) => {
    if (anchors.length < 2 || s <= anchors[0]) return 0;
    for (let k = 1; k < anchors.length; k++) {
      if (s < anchors[k]) return k - 1 + clamp01((s - anchors[k - 1]) / (anchors[k] - anchors[k - 1]));
    }
    return anchors.length - 1;
  };

  const camera = (t: number) => {
    const C = COMPOSITION[layout];
    const portrait = layout === "portrait";
    const area = portrait ? { x: 0, w: vw, cy: vh * 0.4, h: vh * 0.7 } : { x: vw * 0.4, w: vw * 0.6, cy: vh * 0.5, h: vh };
    const base = portrait ? (vw / C.w) * 1.18 : Math.min(area.w / C.w, vh / C.h) * 1.12;
    const whole = portrait ? Math.min((vw * 0.94) / C.w, area.h / C.h) : Math.min((area.w * 0.94) / C.w, (vh * 0.9) / C.h);
    const cam = (k: number) => {
      const [fx, fy, z] = cameras[scenes[k]][layout];
      return { fx, fy, z: z === 0 ? whole : base * z };
    };
    const k = Math.min(scenes.length - 1, Math.floor(t));
    // The camera moves while the objects of the next scene are being set down.
    const f = smooth(clamp01((t - k - 0.15) / 0.7));
    const a = cam(k), b = cam(Math.min(scenes.length - 1, k + 1));
    const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), f));
    const fx = lerp(a.fx, b.fx, f), fy = lerp(a.fy, b.fy, f);
    const ax = area.x + area.w / 2, ay = area.cy;
    return { tx: ax - fx * z, ty: ay - fy * z, z };
  };

  const update = () => {
    const s = window.scrollY;
    const t = sceneT(s);
    const cam = reduce ? camera(scenes.length - 1) : camera(t);
    plane.style.transform = `translate3d(${cam.tx.toFixed(1)}px,${cam.ty.toFixed(1)}px,0) scale(${cam.z.toFixed(4)})`;
    for (const o of objs) {
      let p: number;
      if (o.scene === 0) p = intro;
      else if (reduce) p = t >= o.scene - 0.5 ? 1 : 0;
      else {
        const start = o.scene - 0.9 + (o.order / Math.max(1, o.count)) * 0.35;
        p = easeOut(clamp01((t - start) / 0.42));
      }
      const v = p.toFixed(3);
      if (o.el.dataset.p !== v) { o.el.dataset.p = v; o.el.style.setProperty("--p", v); }
    }
    const idx = Math.round(t);
    if (stage.dataset.scene !== String(idx)) stage.dataset.scene = String(idx);
  };

  // The table is laid on arrival.
  if (!reduce) {
    const t0 = performance.now();
    const step = (now: number) => {
      intro = easeOut(clamp01((now - t0 - 250) / 1300));
      update();
      if (intro < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = window.setTimeout(measure, 150); };
  measure();
  document.fonts?.ready.then(measure);
  window.addEventListener("load", measure);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  portraitQ.addEventListener("change", measure);
  const ro = new ResizeObserver(onResize);
  ro.observe(root);
  return () => {
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("load", measure);
    portraitQ.removeEventListener("change", measure);
    cancelAnimationFrame(raf);
    root.classList.remove("is-live");
  };
}
