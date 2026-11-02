/**
 * THE BOTANICAL PLATE — one continuous root specimen drawn down the whole homepage.
 *
 * Generated from the real page layout (in CSS pixels), so it can respond to the content:
 *  • the taproot routes itself through whitespace and behind photographs, avoiding text;
 *  • lateral roots stop when they reach text, and lean toward food photographs;
 *  • density grows with depth, and everything converges into a root network in the footer;
 *  • small archival annotations (Fig. 1–6) appear only where there is clean space.
 * Rendered in an antique engraving style: double-contour taproot with side hatching,
 * tapering laterals and fine hairs. Deterministic for a given layout and seed.
 */

export type R = { x: number; y: number; w: number; h: number };
export type PlateInput = {
  W: number;
  H: number;
  /** where the hero's taproot leaves the opening scene */
  startX: number;
  startW: number;
  mobile: boolean;
  text: R[];
  media: R[];
  dark: R[];
  footer: R | null;
  sections: Partial<Record<"statement" | "food" | "chapters" | "library", R>>;
  /** the furthest drawing progress the page can reach (bottom of the document) */
  gEnd: number;
  seed?: number;
};

type El = { s: number; t: number; x0: number; x1: number; y0: number; y1: number; svg: string };

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f1 = (n: number) => Math.round(n * 10) / 10;
const smooth = (pts: number[][]) => {
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    d += `Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1((pts[i][0] + pts[i + 1][0]) / 2)} ${f1((pts[i][1] + pts[i + 1][1]) / 2)}`;
  }
  const l = pts[pts.length - 1];
  return d + `L${f1(l[0])} ${f1(l[1])}`;
};
const bbox = (pts: number[][]) => {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { x0, x1, y0, y1 };
};
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export type Tile = { y: number; h: number; svg: string };

export function buildPlate(inp: PlateInput, tileH = 1800): Tile[] {
  const { W, H, mobile, text, media, dark, footer, sections, gEnd } = inp;
  const rand = rng(inp.seed ?? 4217);
  const els: El[] = [];
  const footTop = footer ? footer.y : H;

  // ── Spatial index for text (padded) so collision tests stay cheap ──
  const pad = mobile ? 12 : 20;
  const bucket = 240;
  const grid = new Map<number, R[]>();
  for (const r of text) {
    const p = { x: r.x - pad, y: r.y - pad, w: r.w + pad * 2, h: r.h + pad * 2 };
    for (let b = Math.floor(p.y / bucket); b <= Math.floor((p.y + p.h) / bucket); b++) {
      if (!grid.has(b)) grid.set(b, []);
      grid.get(b)!.push(p);
    }
  }
  const inText = (x: number, y: number) => {
    const list = grid.get(Math.floor(y / bucket));
    if (!list) return false;
    for (const r of list) if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true;
    return false;
  };
  const boxFree = (b: R, extra = 8) => {
    const all = [...text, ...media];
    for (const r of all) {
      if (b.x < r.x + r.w + extra && b.x + b.w + extra > r.x && b.y < r.y + r.h + extra && b.y + b.h + extra > r.y) return false;
    }
    return b.x > 6 && b.x + b.w < W - 6 && b.y > 0 && b.y + b.h < H;
  };
  const inSection = (y: number, k: keyof PlateInput["sections"]) => {
    const r = sections[k];
    return !!r && y >= r.y && y <= r.y + r.h;
  };

  // ── 1. Route the taproot through the page ──
  const margin = mobile ? 12 : 34;
  const endY = footer ? footTop + Math.min(140, footer.h * 0.2) : H - 40;
  const step = mobile ? 200 : 280;
  const cand = mobile ? 11 : 21;
  const route: number[][] = [[inp.startX, 0], [inp.startX, Math.min(80, endY)]];
  let prevX = inp.startX, drift = rand() < 0.5 ? -1 : 1;
  const phase0 = Math.asin(Math.max(-1, Math.min(1, (inp.startX / W - 0.5) / 0.36)));
  for (let y = route[1][1] + step; y < endY; y += step) {
    let best = prevX, bestCost = Infinity;
    for (let i = 0; i < cand; i++) {
      const x = margin + ((W - margin * 2) * i) / (cand - 1);
      let hits = 0;
      for (let k = 0; k <= 24; k++) {
        const t = k / 24;
        if (inText(prevX + (x - prevX) * t, y - step + step * t)) hits++;
        if (inText(x, y - step * 0.5 + step * t)) hits += 0.5;
      }
      const move = Math.abs(x - prevX) / W;
      const sway = (x - prevX) * drift < 0 ? 0.25 : 0; // keep a gentle side-to-side rhythm
      // A slow, deliberate sweep across the page, so the specimen travels from side to side.
      const target = W * (0.5 + 0.36 * Math.sin(phase0 + (y / (mobile ? 1500 : 1900)) * Math.PI));
      const edge = x < margin + 60 || x > W - margin - 60 ? 1.2 : 0;
      const cost = hits * 0.32 + move * (mobile ? 1 : 1.3) + (Math.abs(x - target) / W) * 5 + edge + sway + rand() * 0.3;
      if (cost < bestCost) { bestCost = cost; best = x; }
    }
    if (Math.abs(best - prevX) > W * 0.08) drift = best > prevX ? 1 : -1;
    route.push([best, y]);
    prevX = best;
  }
  // Converge toward the centre for the final network.
  if (footer) route.push([(prevX + W * 0.5) / 2, endY - step * 0.5]);
  route.push([footer ? W * (0.46 + rand() * 0.08) : prevX + (rand() - 0.5) * 30, endY]);

  // Catmull-Rom through the waypoints, then a natural wobble.
  const dense: number[][] = [];
  for (let i = 0; i < route.length - 1; i++) {
    const p0 = route[Math.max(0, i - 1)], p1 = route[i], p2 = route[i + 1], p3 = route[Math.min(route.length - 1, i + 2)];
    const n = Math.max(4, Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 10));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      dense.push([x, y]);
    }
  }
  dense.push(route[route.length - 1]);
  let phase = rand() * 10;
  for (let i = 2; i < dense.length; i++) {
    phase += 0.18 + rand() * 0.08;
    dense[i][0] += Math.sin(phase) * 2.2 + Math.sin(phase * 0.37) * 3.5;
  }

  // ── 2. Draw the taproot in engraved style, piece by piece ──
  const tapW = (y: number) => {
    const base = Math.max(inp.startW, mobile ? 2.4 : 3.4);
    const peak = mobile ? 3.4 : 5.2;
    const k = y / Math.max(1, endY);
    return base + (peak - base) * Math.sin(Math.min(1, k * 1.15) * Math.PI * 0.5) * (k > 0.88 ? 1 - (k - 0.88) * 4 : 1);
  };
  const piece = mobile ? 34 : 40;
  for (let i = 0; i < dense.length - 1; i += piece) {
    const pts = dense.slice(i, Math.min(dense.length, i + piece + 1));
    if (pts.length < 2) continue;
    const b = bbox(pts);
    const w = tapW(b.y0);
    const d = smooth(pts);
    const s = b.y0, t = Math.max(60, b.y1 - b.y0);
    // Hatching on the shaded (left) flank.
    let hatch = "";
    for (let k = 1; k < pts.length - 1; k += 1) {
      const [x, y] = pts[k], [nx, ny] = pts[k + 1];
      const ang = Math.atan2(ny - y, nx - x) - Math.PI / 2;
      const o = w * 0.75, l = w * (1.2 + rand() * 0.5);
      const sx = x + Math.cos(ang) * o, sy = y + Math.sin(ang) * o;
      hatch += `M${f1(sx)} ${f1(sy)}l${f1(Math.cos(ang) * l + (nx - x) * 0.25)} ${f1(Math.sin(ang) * l + (ny - y) * 0.25)}`;
    }
    els.push({
      s, t, ...b,
      svg:
        `<path class="o0" d="${d}" stroke-width="${f1(w)}" pathLength="1" style="--s:${f1(s)};--t:${f1(t)}"/>` +
        `<path class="core" d="${d}" stroke-width="${f1(w * 0.36)}" pathLength="1" style="--s:${f1(s)};--t:${f1(t)}"/>` +
        `<path class="hatch" d="${hatch}" style="--s:${f1(s)};--t:${f1(t)}"/>`,
    });
  }

  // ── 3. Laterals, secondaries and hairs ──
  const tips: number[][] = [];
  const pull = [0, 0.05, 0.08, 0.1, 0.12];
  const wander = [0, 0.16, 0.26, 0.34, 0.4];
  const widthOf = (o: number) => (mobile ? [0, 1.3, 0.85, 0.55, 0.4] : [0, 1.7, 1.05, 0.7, 0.5])[o];
  let budget = mobile ? 300 : 1500;

  const grow = (x: number, y: number, ang: number, len: number, order: number, s0: number, opts: { stopText: boolean; maxOrder: number; attract?: number[]; gravity?: number }) => {
    if (budget-- <= 0) return;
    const stepL = 8;
    const pts: number[][] = [[x, y]];
    let a = ang, cx = x, cy = y;
    for (let i = 0; i < len / stepL; i++) {
      a += (Math.PI / 2 - a) * pull[order] * (opts.gravity ?? 1) + (rand() - 0.5) * wander[order];
      if (opts.attract) {
        const ta = Math.atan2(opts.attract[1] - cy, opts.attract[0] - cx);
        let dA = ta - a; while (dA > Math.PI) dA -= 2 * Math.PI; while (dA < -Math.PI) dA += 2 * Math.PI;
        a += dA * 0.07;
      }
      const nx = cx + Math.cos(a) * stepL, ny = cy + Math.sin(a) * stepL;
      if (nx < 3 || nx > W - 3 || ny > H - 3 || ny < 0) break;
      if (opts.stopText && inText(nx, ny)) break;
      cx = nx; cy = ny;
      pts.push([cx, cy]);
    }
    if (pts.length < 4) return;
    const b = bbox(pts);
    const t = Math.max(120, (b.y1 - b.y0) * 1.1 + 80);
    const w = widthOf(order);
    els.push({ s: s0, t, ...b, svg: `<path class="o${order}" d="${smooth(pts)}" stroke-width="${w}" pathLength="1" style="--s:${f1(s0)};--t:${f1(t)}"/>` });
    tips.push(pts[pts.length - 1], pts[Math.floor(pts.length / 2)]);

    // Root hairs near the tip of finer roots.
    if (order >= 2 && rand() < 0.75) {
      let hd = "";
      for (let k = Math.floor(pts.length * 0.45); k < pts.length - 1; k++) {
        const [px, py] = pts[k], [qx, qy] = pts[k + 1];
        const base = Math.atan2(qy - py, qx - px);
        for (const side of [-1, 1]) {
          if (rand() < 0.45) continue;
          const ha = base + side * (1.2 + rand() * 0.4), hl = 3 + rand() * (mobile ? 4 : 6);
          hd += `M${f1(px)} ${f1(py)}l${f1(Math.cos(ha) * hl)} ${f1(Math.sin(ha) * hl)}`;
        }
      }
      if (hd) els.push({ s: s0 + t * 0.6, t: 120, ...b, svg: `<path class="hair" d="${hd}" style="--s:${f1(s0 + t * 0.6)};--t:120"/>` });
    }

    if (order >= opts.maxOrder) return;
    const kids = order === 1 ? 2 + Math.floor(rand() * 3) : rand() < 0.6 ? 1 + Math.floor(rand() * 2) : 0;
    for (let k = 0; k < kids; k++) {
      const at = 0.2 + rand() * 0.65;
      const idx = Math.max(1, Math.floor(at * (pts.length - 1)));
      const [bx, by] = pts[idx];
      const [qx, qy] = pts[Math.min(pts.length - 1, idx + 1)];
      const base = Math.atan2(qy - by, qx - bx);
      const side = k % 2 === 0 ? 1 : -1;
      grow(bx, by, base + side * (0.6 + rand() * 0.7), len * (0.38 + rand() * 0.3), order + 1, s0 + t * at * 0.8, opts);
    }
  };

  // Laterals off the taproot, denser with depth; food photographs attract nearby roots.
  const spacing = mobile ? 18 : 7;
  for (let i = 10; i < dense.length - 6; i += spacing + Math.floor(rand() * spacing)) {
    const [x, y] = dense[i];
    if (y > footTop - 40) break;
    const depth = y / Math.max(1, endY);
    const [nx, ny] = dense[i + 1];
    const base = Math.atan2(ny - y, nx - x);
    const roomLeft = x / W, roomRight = 1 - roomLeft;
    const side = rand() < roomRight / (roomLeft + roomRight) ? -1 : 1; // toward the roomier side (angles measured from the root's direction)
    let attract: number[] | undefined;
    if (inSection(y, "food")) {
      let bestD = Infinity;
      for (const m of media) {
        const mx = m.x + m.w / 2, my = m.y + m.h / 2;
        const dd = Math.hypot(mx - x, my - y);
        if (dd < bestD && my > y - 200) { bestD = dd; attract = [mx, my]; }
      }
      if (bestD > (mobile ? 500 : 900)) attract = undefined;
    }
    const len = (mobile ? 70 : 140) + rand() * (mobile ? 140 : 300) * (0.6 + depth * 0.7);
    grow(x, y, base + side * (0.9 + rand() * 0.6), len, 1, y, { stopText: true, maxOrder: mobile ? 2 : 3, attract });
    if (!mobile && rand() < 0.35 + depth * 0.3) grow(x, y, base - side * (1 + rand() * 0.5), len * 0.6, 1, y, { stopText: true, maxOrder: 3 });
  }

  // ── 4. The convergence: the whole system spreads into one dense network across the footer ──
  if (footer) {
    const [ex, ey] = dense[dense.length - 1];
    const startS = Math.max(0, footTop - 260);
    budget += mobile ? 220 : 700;
    const fanN = mobile ? 9 : 18;
    for (let k = 0; k < fanN; k++) {
      const t = k / (fanN - 1);
      const ang = 0.12 + t * (Math.PI - 0.24) + (rand() - 0.5) * 0.1;
      const reach = (Math.abs(Math.cos(ang)) * W * 0.58 + footer.h * 0.55) * (0.85 + rand() * 0.3);
      grow(ex, ey, ang, reach, 1, startS + k * 18, { stopText: false, maxOrder: mobile ? 3 : 4, gravity: 0.22 });
    }
    // Secondary crowns: a few strong roots arriving from either side, so the network reads edge to edge.
    for (const side of [0.12, 0.88, 0.3, 0.7]) {
      const sx = W * side, sy = footTop - (mobile ? 60 : 120);
      grow(sx, sy, Math.PI / 2 + (side < 0.5 ? -0.9 : 0.9), footer.h * 0.9, 1, startS + 80, { stopText: false, maxOrder: mobile ? 3 : 4, gravity: 0.3 });
    }
  }

  // ── 5. Mycorrhizal hyphae around the chapters ──
  const ch = sections.chapters;
  if (ch) {
    const near = tips.filter(([x, y]) => y > ch.y && y < ch.y + ch.h).slice(0, mobile ? 4 : 9);
    for (const [x, y] of near) {
      let d = "";
      for (let j = 0; j < 5; j++) {
        let hx = x, hy = y, a = rand() * Math.PI * 2;
        for (let s = 0; s < 18; s++) {
          a += (rand() - 0.5) * 0.9;
          hx += Math.cos(a) * 4; hy += Math.sin(a) * 4;
          if (s % 2 === 0) d += `M${f1(hx)} ${f1(hy)}h0.6`;
        }
      }
      els.push({ s: y + 40, t: 160, x0: x - 80, x1: x + 80, y0: y - 80, y1: y + 80, svg: `<path class="hyph" d="${d}" style="--s:${f1(y + 40)};--t:160"/>` });
    }
  }

  // ── 6. Archival annotations, only where the page is clean ──
  const fs = mobile ? 10 : 12;
  const label = (txt: string, k: keyof PlateInput["sections"] | "footer", prefer?: number[]) => {
    const range = k === "footer" ? footer : sections[k];
    if (!range) return;
    const pool = tips.filter(([, y]) => y > range.y + 20 && y < range.y + range.h - 20);
    if (prefer) pool.unshift(prefer);
    const tw = txt.length * fs * 0.52 + 6;
    for (const [px, py] of pool) {
      for (const [dx, dy] of [[26, -34], [-26 - tw, -34], [26, 26], [-26 - tw, 26]]) {
        const box = { x: px + dx, y: py + dy - fs, w: tw, h: fs + 6 };
        if (k !== "footer" && !boxFree(box, 14)) continue;
        if (k === "footer" && (box.x < 6 || box.x + box.w > W - 6 || box.y + box.h > H - 4)) continue;
        const lx = dx > 0 ? box.x - 4 : box.x + box.w + 4;
        const s = py;
        els.push({
          s, t: 140, x0: Math.min(px, box.x), x1: Math.max(px, box.x + box.w), y0: Math.min(py, box.y), y1: Math.max(py, box.y + box.h),
          svg: `<g class="ann" style="--s:${f1(s)};--t:140"><path d="M${f1(px)} ${f1(py)}L${f1(lx)} ${f1(py + dy - fs * 0.35)}"/><circle cx="${f1(px)}" cy="${f1(py)}" r="1.6"/><text x="${f1(box.x)}" y="${f1(box.y + fs)}" font-size="${fs}">${esc(txt)}</text></g>`,
        });
        return;
      }
    }
  };
  label("Fig. 1 — Radix primaria", "statement", dense[Math.min(dense.length - 1, 30)]);
  label("Fig. 2 — Radices laterales", "food");
  label("Fig. 3 — Hyphae mycorrhizae", "chapters");

  // Fig. 4: an enlarged root tip in a roundel, placed in clean space within the Library.
  const lib = sections.library;
  if (lib && !mobile) {
    const r = 64;
    let placed = false;
    for (let y = lib.y + r + 20; y < lib.y + lib.h - r && !placed; y += 36) {
      for (let x = W - r - 30; x > r + 30 && !placed; x -= 36) {
        const box = { x: x - r - 16, y: y - r - 16, w: r * 2 + 32, h: r * 2 + 48 };
        if (!boxFree(box, 10)) continue;
        let hairs = "";
        for (let k = 0; k < 34; k++) {
          const t = k / 34, cy = y - r + t * r * 1.5, cx = x - r * 0.55 + t * r * 0.7;
          for (const side of [-1, 1]) {
            const l = 6 + Math.sin(t * Math.PI) * 14;
            hairs += `M${f1(cx + side * 7)} ${f1(cy)}l${f1(side * l)} ${f1(-l * 0.25)}`;
          }
        }
        const s = y - r;
        els.push({
          s, t: 220, x0: box.x, x1: box.x + box.w, y0: box.y, y1: box.y + box.h,
          svg:
            `<g class="ann ann--fig" style="--s:${f1(s)};--t:220"><defs><clipPath id="pl-round"><circle cx="${f1(x)}" cy="${f1(y)}" r="${r - 4}"/></clipPath></defs>` +
            `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" class="ring"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${r - 4}" class="ring ring--in"/>` +
            `<g clip-path="url(#pl-round)"><path class="mag" d="M${f1(x - r * 0.75)} ${f1(y - r * 1.1)}C${f1(x - r * 0.4)} ${f1(y - r * 0.5)} ${f1(x - r * 0.05)} ${f1(y)} ${f1(x + r * 0.18)} ${f1(y + r * 0.45)}" stroke-width="12"/>` +
            `<path class="mag mag--core" d="M${f1(x - r * 0.75)} ${f1(y - r * 1.1)}C${f1(x - r * 0.4)} ${f1(y - r * 0.5)} ${f1(x - r * 0.05)} ${f1(y)} ${f1(x + r * 0.18)} ${f1(y + r * 0.45)}" stroke-width="7"/>` +
            `<path class="mag mag--hair" d="${hairs}"/></g>` +
            `<text x="${f1(x - r)}" y="${f1(y + r + 22)}" font-size="${fs}">Fig. 4 — Apex radicis, aucta</text></g>`,
        });
        placed = true;
      }
    }
  }
  label("Fig. 5 — Pili radicales", "library");
  if (footer) label("Fig. 6 — Systema radicum", "footer", [W * (mobile ? 0.5 : 0.62), footTop + footer.h * 0.12]);

  // ── Timing: nothing may need more scroll than the page has ──
  for (const e of els) {
    if (e.s > gEnd - 40) { e.s = gEnd - 80; e.t = 40; }
    else if (e.s + e.t > gEnd) e.t = Math.max(30, gEnd - e.s);
  }

  // ── Render as stacked tiles: one huge mask is beyond what browsers will rasterise. ──
  const darkRects = dark.map((r) => ({ ...r, x: 0, w: W }));
  const rect = (r: R, p: number, fill: string, op = 1, rx = 8) =>
    `<rect x="${f1(r.x - p)}" y="${f1(r.y - p)}" width="${f1(r.w + p * 2)}" height="${f1(r.h + p * 2)}" rx="${rx}" fill="${fill}"${op < 1 ? ` fill-opacity="${op}"` : ""}/>`;
  const touchesDark = (e: El) => darkRects.some((r) => e.y1 >= r.y && e.y0 <= r.y + r.h);
  const bandSize = 700;
  const tiles: Tile[] = [];
  let n = 0;
  for (let ty = 0; ty < H; ty += tileH, n++) {
    const th = Math.min(tileH, H - ty);
    const hit = (r: R, p = 40) => r.y - p < ty + th && r.y + r.h + p > ty;
    // Footer lines are small and close together: tighter masks let the network show between them.
    const textMask = text.filter((r) => hit(r)).map((r) => (r.y >= footTop ? rect(r, 16, "#000", 0.55, 10) + rect(r, 7, "#000", 1, 6) : mobile
          ? rect(r, 10, "#000", 0.35, 12) + rect(r, 3, "#000", 0.8, 6) // phones: the root stays continuous, very faint behind text
          : rect(r, 30, "#000", 0.5, 22) + rect(r, 12, "#000", 1, 10))).join("");
    // On phones content fills the width, so the root stays faintly continuous behind photographs too.
    const mediaMask = media.filter((r) => hit(r)).map((r) => rect(r, -1, "#000", mobile ? 0.86 : 1, 2)).join("");
    const darkHere = darkRects.filter((r) => hit(r, 0));
    const box = `x="0" y="${ty}" width="${W}" height="${th}"`;
    const maskA = `<mask id="pl-a${n}" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#fff"/>${darkHere.map((r) => rect(r, 0, "#000", 1, 0)).join("")}${textMask}${mediaMask}</mask>`;
    const maskB = darkHere.length ? `<mask id="pl-b${n}" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#000"/>${darkHere.map((r) => rect(r, 0, "#fff", 1, 0)).join("")}${textMask}${mediaMask}</mask>` : "";
    const bandsA = new Map<number, string[]>();
    const bandsB = new Map<number, string[]>();
    for (const e of els) {
      if (e.y1 < ty - 20 || e.y0 > ty + th + 20) continue;
      const b = Math.floor(e.s / bandSize);
      const svgA = e.svg.replace(/pl-round/g, `pl-round-a${n}`);
      if (!bandsA.has(b)) bandsA.set(b, []);
      bandsA.get(b)!.push(svgA);
      if (maskB && touchesDark(e)) {
        if (!bandsB.has(b)) bandsB.set(b, []);
        bandsB.get(b)!.push(e.svg.replace(/pl-round/g, `pl-round-b${n}`));
      }
    }
    const out = (m: Map<number, string[]>) =>
      [...m.entries()].sort((a, b) => a[0] - b[0]).map(([b, list]) => `<g class="pb" data-b="${b * bandSize}">${list.join("")}</g>`).join("");
    tiles.push({
      y: ty, h: th,
      svg: `<defs>${maskA}${maskB}</defs><g class="plate-ink" mask="url(#pl-a${n})">${out(bandsA)}</g>${maskB ? `<g class="plate-light" mask="url(#pl-b${n})">${out(bandsB)}</g>` : ""}`,
    });
  }
  return tiles;
}
