import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const INPUT_ROOT = path.resolve("src/assets/photos/_originals");
const OUTPUT_ROOT = path.resolve("public/photos");
const MANIFEST_PATH = path.resolve("src/content/photos.manifest.json");

// Target widths (browser will choose via srcset)
const TARGET_WIDTHS = [480, 768, 1024, 1280, 1600];
const THUMB_WIDTH = 320;

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

function shaId(str) {
  return crypto.createHash("sha1").update(str).digest("hex").slice(0, 10);
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

function toWebPath(absPath) {
  // Ensure forward slashes for web
  return absPath.split(path.sep).join("/");
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function buildOne(absFile, category) {
  const rel = path.relative(path.join(INPUT_ROOT, category), absFile); // includes subfolders
  const relNorm = rel.split(path.sep).join("/");

  const ext = path.extname(absFile).toLowerCase();
  if (!IMG_EXT.has(ext)) return null;

  const id = shaId(`${category}/${relNorm}`);
  const album = category === "medina"
    ? (relNorm.includes("/") ? relNorm.split("/")[0] : "General")
    : "Institute";

  const img = sharp(absFile, { failOn: "none" });
  const meta = await img.metadata();
  const origW = meta.width ?? 0;
  const origH = meta.height ?? 0;

  if (!origW || !origH) return null;

  // Avoid enlarging beyond original width
  const widths = TARGET_WIDTHS.filter(w => w <= origW);
  if (widths.length === 0) widths.push(origW);

  // Always generate a small thumb (also without enlargement)
  const thumbW = Math.min(THUMB_WIDTH, origW);

  const outDir = path.join(OUTPUT_ROOT, category);
  await ensureDir(outDir);

  // Generate thumb
  const thumbName = `${id}-thumb.webp`;
  const thumbAbs = path.join(outDir, thumbName);
  await sharp(absFile, { failOn: "none" })
    .resize({ width: thumbW, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(thumbAbs);

  // Generate responsive set
  const candidates = [];
  for (const w of widths) {
    const name = `${id}-${w}.webp`;
    const outAbs = path.join(outDir, name);
    await sharp(absFile, { failOn: "none" })
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(outAbs);

    candidates.push({
      w,
      url: `/photos/${category}/${name}`,
    });
  }

  candidates.sort((a, b) => a.w - b.w);

  // Pick a sensible default src (closest to 1024, otherwise largest)
  const preferred = candidates.reduce((best, c) => {
    if (!best) return c;
    return Math.abs(c.w - 1024) < Math.abs(best.w - 1024) ? c : best;
  }, null);

  const srcSet = candidates.map(c => `${c.url} ${c.w}w`).join(", ");

  return {
    id,
    category,                 // "medina" | "institute"
    album,                    // subfolder name for medina, "Institute" for institute
    originalRelativePath: `${category}/${relNorm}`,
    width: origW,
    height: origH,
    thumb: `/photos/${category}/${thumbName}`,
    src: preferred.url,
    srcSet,
  };
}

async function main() {
  const categories = ["medina", "institute"];
  const manifest = [];

  for (const category of categories) {
    const dir = path.join(INPUT_ROOT, category);
    await ensureDir(path.join(OUTPUT_ROOT, category));

    const files = await walk(dir);
    for (const f of files) {
      const item = await buildOne(f, category);
      if (item) manifest.push(item);
    }
  }

  manifest.sort((a, b) =>
    (a.category + a.album + a.id).localeCompare(b.category + b.album + b.id)
  );

  await ensureDir(path.dirname(MANIFEST_PATH));
  await fs.writeFile(MANIFEST_PATH, JSON.stringify({ version: 1, items: manifest }, null, 2) + "\n", "utf8");

  console.log(`Processed: ${manifest.length} photos`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
