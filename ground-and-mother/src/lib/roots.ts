/**
 * Deterministic botanical root generator.
 *
 * Grows a taproot with laterals and fine roots using simple plant rules:
 * gravitropism (roots bend back toward "down"), decreasing thickness with each order,
 * laterals emerging alternately along the parent, and a little natural wander.
 * The same seed always produces the same roots, so server and client render identically.
 *
 * Every segment carries a start time and duration in "root time" (0–1), so scroll progress
 * can draw the system the way a real root system develops: taproot first, then laterals.
 */
export type RootSeg = {
  d: string;
  /** stroke width in viewBox units */
  w: number;
  /** when this segment starts drawing (0–1) */
  s: number;
  /** how long it takes to draw (0–1) */
  t: number;
  /** branch order: 0 = taproot */
  o: number;
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Smooth path through points using quadratic curves between midpoints. */
function smooth(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${r1(x)} ${r1(y)} ${r1((x + nx) / 2)} ${r1((y + ny) / 2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L${r1(last[0])} ${r1(last[1])}`;
  return d;
}

type Opts = { seed?: number; x: number; y: number; length: number; width: number; maxOrder?: number; bounds?: { w: number; h: number } };

export function growRoots({ seed = 7, x, y, length, width, maxOrder = 3, bounds = { w: 1000, h: 1000 } }: Opts): RootSeg[] {
  const rand = rng(seed);
  const segs: RootSeg[] = [];

  const grow = (x0: number, y0: number, angle: number, len: number, w: number, order: number, start: number, dur: number) => {
    const steps = Math.max(5, Math.round(len / 14));
    const step = len / steps;
    const pts: [number, number][] = [[x0, y0]];
    let a = angle;
    let cx = x0, cy = y0;
    // Gravitropism weakens with order: fine roots wander more.
    const pull = order === 0 ? 0.18 : order === 1 ? 0.11 : 0.06;
    const wander = order === 0 ? 0.09 : order === 1 ? 0.18 : 0.3;
    for (let i = 0; i < steps; i++) {
      a += (Math.PI / 2 - a) * pull + (rand() - 0.5) * wander;
      cx += Math.cos(a) * step;
      cy += Math.sin(a) * step;
      if (cy > bounds.h + 40 || cx < -60 || cx > bounds.w + 60) break;
      pts.push([cx, cy]);
    }

    // Draw in three tapering pieces so the root thins naturally toward its tip.
    const pieces = order >= 2 ? 1 : 3;
    const per = Math.ceil((pts.length - 1) / pieces);
    for (let p = 0; p < pieces; p++) {
      const slice = pts.slice(p * per, Math.min(pts.length, (p + 1) * per + 1));
      if (slice.length < 2) continue;
      const taper = order === 0 ? Math.max(0.55, Math.pow(1 - p / (pieces + 0.2), 1.6)) : Math.pow(1 - p / (pieces + 0.2), 1.6);
      segs.push({ d: smooth(slice), w: r1(Math.max(0.5, w * taper) * 10) / 10, s: start + (dur * p) / pieces, t: dur / pieces, o: order });
    }

    if (order >= maxOrder) return;
    // Laterals: alternate sides, shorter and thinner, emerging along the parent.
    const count = order === 0 ? 12 : order === 1 ? 4 : 3;
    for (let i = 0; i < count; i++) {
      const at = 0.12 + (i / count) * 0.8 + (rand() - 0.5) * 0.05;
      const idx = Math.min(pts.length - 1, Math.max(1, Math.round(at * (pts.length - 1))));
      const [bx, by] = pts[idx];
      const side = i % 2 === 0 ? -1 : 1;
      const spread = order === 0 ? 0.95 + rand() * 0.45 : 0.7 + rand() * 0.6;
      const childLen = len * (order === 0 ? 0.5 - at * 0.3 : 0.42) * (0.7 + rand() * 0.5);
      const childStart = start + dur * at * 0.9;
      grow(bx, by, Math.PI / 2 + side * spread, childLen, w * (order === 0 ? 0.42 : 0.5), order + 1, childStart, Math.min(0.42, dur * 0.7));
    }
  };

  grow(x, y, Math.PI / 2 + 0.08, length, width, 0, 0, 0.55);
  // Normalise so the whole system finishes at 1.
  const end = Math.max(...segs.map((s) => s.s + s.t));
  return segs.map((s) => ({ ...s, s: Math.round((s.s / end) * 1000) / 1000, t: Math.round((s.t / end) * 1000) / 1000 }));
}

/** A single meandering stem for the page-long root line (vertical, in a narrow viewBox). */
export function spinePath(seed = 3, w = 60, h = 1000) {
  const rand = rng(seed);
  const main: [number, number][] = [];
  const laterals: string[] = [];
  let x = w / 2;
  for (let y = 0; y <= h; y += 12) {
    x += (rand() - 0.5) * 3.2 + (w / 2 - x) * 0.05;
    main.push([x, y]);
    if (y > 20 && y % 96 === 0) {
      const side = (y / 96) % 2 === 0 ? 1 : -1;
      const pts: [number, number][] = [[x, y]];
      let lx = x, ly = y, a = Math.PI / 2 - side * (0.9 + rand() * 0.4);
      for (let i = 0; i < 5; i++) {
        a += (Math.PI / 2 - a) * 0.12;
        lx += Math.cos(a) * 7;
        ly += Math.sin(a) * 7;
        pts.push([lx, ly]);
      }
      laterals.push(smooth(pts));
    }
  }
  return { main: smooth(main), laterals };
}
