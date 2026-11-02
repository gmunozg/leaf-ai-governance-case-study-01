// Download a licensed photograph into public/images and record its credit.
//
//   node scripts/add-photo.mjs <image-url> <file-name.jpg> \
//     --credit "Photographer Name" --source "https://page-of-the-photo" --license "Unsplash License"
//
// Then reference it from content (e.g. foods.ts → image: { src: "/images/food/egg-yolk.jpg", ... }).
// Only use photographs whose licence allows commercial use on a website, and keep the source page URL.
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const [, , url, name, ...rest] = process.argv;
const opt = (k) => { const i = rest.indexOf(`--${k}`); return i > -1 ? rest[i + 1] : ""; };
if (!url || !name || !opt("credit") || !opt("source") || !opt("license")) {
  console.error("Usage: node scripts/add-photo.mjs <url> <file-name> --credit <name> --source <page-url> --license <licence>");
  process.exit(1);
}
const res = await fetch(url);
if (!res.ok) { console.error(`Download failed: ${res.status} ${res.statusText}`); process.exit(1); }
const dest = join("public/images", name);
await mkdir(dirname(dest), { recursive: true });
await writeFile(dest, Buffer.from(await res.arrayBuffer()));

const ledger = "src/content/photo-credits.json";
const list = JSON.parse(await readFile(ledger, "utf8").catch(() => "[]"));
list.push({ file: `/images/${name}`, credit: opt("credit"), source: opt("source"), license: opt("license"), added: new Date().toISOString().slice(0, 10) });
await writeFile(ledger, JSON.stringify(list, null, 2) + "\n");
console.log(`Saved ${dest} and recorded the credit in ${ledger}.`);
