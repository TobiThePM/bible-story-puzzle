/**
 * Art pipeline: full-resolution source art -> shipped game assets.
 *
 *   node scripts/process-art.mjs
 *
 * Reads every image in assets-source/ and writes, into public/stories/:
 *   <name>.webp         1200x1200, quality 82  (the puzzle image)
 *   <name>-thumb.webp     240x240, quality 78  (results + library lists)
 *
 * Then runs the CONFUSABLE-TILE CHECK from SPEC.md 12 on each image: it cuts
 * the picture into 3x3, 4x4 and 5x5 grids exactly as the game does, fingerprints
 * every tile, and compares all pairs. Two tiles that look too alike make a
 * puzzle unsolvable by sight - the player is left guessing. Any image that fails
 * should be regenerated with more texture and local contrast.
 *
 * assets-source/ is gitignored: the big originals stay on your machine, only the
 * optimised files are committed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.resolve(__dirname, '../assets-source');
const OUT_DIR = path.resolve(__dirname, '../public/stories');

const FULL = 1200;
const THUMB = 240;
const GRIDS = [3, 4, 5];

/** Mean per-channel difference below this and two tiles read as "the same". */
const CONFUSABLE_THRESHOLD = 12;
/** Comfortable margin - anything above this is clearly distinct. */
const COMFORTABLE = 20;

/** Fingerprint: 8x8 RGB thumbnail of one tile, as raw bytes. */
async function fingerprint(buffer, left, top, size) {
  return sharp(buffer)
    .extract({ left, top, width: size, height: size })
    .resize(8, 8, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer();
}

function meanAbsDiff(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) total += Math.abs(a[i] - b[i]);
  return total / a.length;
}

async function checkGrid(buffer, grid) {
  const size = Math.floor(FULL / grid);
  const prints = [];
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      prints.push(await fingerprint(buffer, col * size, row * size, size));
    }
  }

  let worst = { distance: Infinity, a: -1, b: -1 };
  const failures = [];

  for (let i = 0; i < prints.length; i++) {
    for (let j = i + 1; j < prints.length; j++) {
      const distance = meanAbsDiff(prints[i], prints[j]);
      if (distance < worst.distance) worst = { distance, a: i, b: j };
      if (distance < CONFUSABLE_THRESHOLD) failures.push({ i, j, distance });
    }
  }

  return { grid, worst, failures };
}

const label = (index, grid) => `r${Math.floor(index / grid) + 1}c${(index % grid) + 1}`;

async function processOne(file) {
  const name = path.parse(file).name;
  const src = path.join(SOURCE_DIR, file);

  // Non-square sources are centre-cropped by `fit: 'cover'` below, never
  // squashed. Canva exports 16:9, so this is the normal path - prompt for the
  // subject to sit in the central square and the crop takes care of itself.
  const meta = await sharp(src).metadata();
  const cropped = meta.width !== meta.height;

  const full = await sharp(src).resize(FULL, FULL, { fit: 'cover' }).webp({ quality: 82 }).toBuffer();
  fs.writeFileSync(path.join(OUT_DIR, `${name}.webp`), full);

  const thumb = await sharp(src).resize(THUMB, THUMB, { fit: 'cover' }).webp({ quality: 78 }).toBuffer();
  fs.writeFileSync(path.join(OUT_DIR, `${name}-thumb.webp`), thumb);

  const kb = (full.length / 1024).toFixed(0);
  const thumbKb = (thumb.length / 1024).toFixed(0);

  const results = [];
  for (const grid of GRIDS) results.push(await checkGrid(full, grid));

  const failed = results.some((r) => r.failures.length > 0);
  const tightest = results.reduce((a, b) => (a.worst.distance < b.worst.distance ? a : b));

  console.log(
    `\n  ${name}.webp  ${kb} KB  (+ thumb ${thumbKb} KB)${cropped ? `  [centre-cropped from ${meta.width}x${meta.height}]` : ''}`
  );
  for (const r of results) {
    const d = r.worst.distance.toFixed(1);
    const mark = r.failures.length ? 'FAIL' : r.worst.distance < COMFORTABLE ? 'tight' : 'ok';
    console.log(
      `    ${r.grid}x${r.grid}: closest pair ${label(r.worst.a, r.grid)} / ${label(r.worst.b, r.grid)} = ${d}  [${mark}]`
    );
    for (const f of r.failures) {
      console.log(
        `        too alike: ${label(f.i, r.grid)} and ${label(f.j, r.grid)} (${f.distance.toFixed(1)})`
      );
    }
  }

  return { name, failed, tightest: tightest.worst.distance, bytes: full.length + thumb.length };
}

// ---------------------------------------------------------------------------

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`No assets-source/ directory. Put full-resolution square art there first.`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs
  .readdirSync(SOURCE_DIR)
  .filter((f) => /\.(png|jpe?g|webp|tiff?)$/i.test(f))
  .sort();

if (!files.length) {
  console.error('assets-source/ has no images in it.');
  process.exit(1);
}

console.log(`Processing ${files.length} image${files.length === 1 ? '' : 's'} from assets-source/`);

const summary = [];
for (const file of files) summary.push(await processOne(file));

const failed = summary.filter((s) => s.failed);
const totalKb = summary.reduce((n, s) => n + s.bytes, 0) / 1024;

console.log(`\n${'-'.repeat(60)}`);
console.log(`Done. ${summary.length} processed, ${(totalKb / 1024).toFixed(2)} MB shipped.`);

if (failed.length) {
  console.log(`\n${failed.length} image(s) FAILED the confusable-tile check:`);
  for (const f of failed) console.log(`  - ${f.name}`);
  console.log('Regenerate these with more texture and local contrast across the frame.');
  process.exit(1);
}

console.log('All images passed the confusable-tile check.');
