/**
 * Generates 20 placeholder illustrations so the game is fully playable
 * before any real artwork exists.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * These are deliberately busy and high-contrast: every region of every image
 * carries detail, so no two tiles of a 4x4 or 5x5 cut are confusable. That is
 * the same constraint the real illustrations must meet (see SPEC.md 12).
 *
 * To swap in real art later: drop 1200x1200 .webp files into public/stories/
 * and change the `image` / `thumb` paths in src/content/stories.ts.
 * Nothing else in the codebase needs to change.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/stories');

const SIZE = 1200;

// One palette per story, loosely matching the mood of each scene.
const STORIES = [
  { file: '01-creation.svg', hues: [220, 45], dark: '#05070f', light: '#ffd98a' },
  { file: '02-noahs-ark.svg', hues: [200, 30], dark: '#0a1c2b', light: '#e8b06a' },
  { file: '03-tower-of-babel.svg', hues: [28, 200], dark: '#2b1a0d', light: '#e0c9a6' },
  { file: '04-abraham-stars.svg', hues: [245, 50], dark: '#050614', light: '#fff2c4' },
  { file: '05-josephs-coat.svg', hues: [340, 45], dark: '#2a0f1e', light: '#ffd166' },
  { file: '06-burning-bush.svg', hues: [20, 95], dark: '#1b0d05', light: '#ffb23f' },
  { file: '07-passover.svg', hues: [230, 35], dark: '#080c1a', light: '#ffc76b' },
  { file: '08-red-sea.svg', hues: [195, 10], dark: '#04202e', light: '#9fe4f5' },
  { file: '09-ten-commandments.svg', hues: [250, 40], dark: '#0d0a1a', light: '#f2e5b8' },
  { file: '10-jericho.svg', hues: [35, 15], dark: '#2a1c0e', light: '#e9c88f' },
  { file: '11-gideons-300.svg', hues: [255, 30], dark: '#070a18', light: '#ffb84d' },
  { file: '12-samson.svg', hues: [15, 200], dark: '#221008', light: '#dbb98a' },
  { file: '13-david-goliath.svg', hues: [40, 210], dark: '#1a1a10', light: '#f0dfa8' },
  { file: '14-solomons-temple.svg', hues: [45, 190], dark: '#241a06', light: '#ffe08a' },
  { file: '15-mount-carmel.svg', hues: [10, 260], dark: '#1d0808', light: '#ff9a3c' },
  { file: '16-chariots-of-fire.svg', hues: [30, 215], dark: '#0f1424', light: '#ffc25e' },
  { file: '17-fiery-furnace.svg', hues: [18, 55], dark: '#230a04', light: '#ffd27a' },
  { file: '18-lions-den.svg', hues: [35, 250], dark: '#140f08', light: '#f3c877' },
  { file: '19-jonah.svg', hues: [190, 275], dark: '#021420', light: '#7fd8e8' },
  { file: '20-potters-house.svg', hues: [25, 165], dark: '#1e1208', light: '#e7c08f' },
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n) => Math.round(n * 100) / 100;

function build(story, index) {
  const rand = mulberry32(1000 + index * 7919);
  const [hueA, hueB] = story.hues;
  const parts = [];

  const pick = (min, max) => min + rand() * (max - min);
  const hue = () => (rand() < 0.5 ? hueA : hueB) + pick(-18, 18);

  // --- background wash -------------------------------------------------
  parts.push(`<rect width="${SIZE}" height="${SIZE}" fill="url(#bg${index})"/>`);

  // --- three large soft forms: gives the image big-scale composition ----
  for (let i = 0; i < 3; i++) {
    const cx = r2(pick(150, SIZE - 150));
    const cy = r2(pick(150, SIZE - 150));
    const rr = r2(pick(260, 520));
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="hsl(${r2(hue())} 70% ${r2(pick(35, 62))}%)" opacity="${r2(pick(0.18, 0.4))}"/>`
    );
  }

  // --- a horizon band ---------------------------------------------------
  const horizon = r2(pick(520, 820));
  parts.push(
    `<rect x="0" y="${horizon}" width="${SIZE}" height="${r2(SIZE - horizon)}" fill="hsl(${r2(hueA)} 45% 18%)" opacity="0.55"/>`
  );

  // --- rays / beams: strong diagonal structure --------------------------
  for (let i = 0; i < 9; i++) {
    const x1 = r2(pick(-200, SIZE));
    const x2 = r2(x1 + pick(-420, 420));
    parts.push(
      `<path d="M${x1} 0 L${r2(x1 + pick(30, 90))} 0 L${r2(x2 + pick(30, 90))} ${SIZE} L${x2} ${SIZE} Z" fill="${story.light}" opacity="${r2(pick(0.04, 0.12))}"/>`
    );
  }

  // --- mid-scale shapes -------------------------------------------------
  for (let i = 0; i < 14; i++) {
    const cx = r2(pick(0, SIZE));
    const cy = r2(pick(0, SIZE));
    const w = r2(pick(70, 240));
    const h = r2(pick(70, 240));
    const rot = r2(pick(0, 360));
    parts.push(
      `<rect x="${r2(cx - w / 2)}" y="${r2(cy - h / 2)}" width="${w}" height="${h}" rx="${r2(pick(0, 40))}" transform="rotate(${rot} ${cx} ${cy})" fill="hsl(${r2(hue())} 72% ${r2(pick(42, 70))}%)" opacity="${r2(pick(0.16, 0.42))}"/>`
    );
  }

  // --- fine detail on a jittered grid ----------------------------------
  // The important bit: this guarantees EVERY region of the image carries
  // local detail, so no two puzzle tiles can look alike.
  const CELLS = 10;
  const step = SIZE / CELLS;
  for (let gy = 0; gy < CELLS; gy++) {
    for (let gx = 0; gx < CELLS; gx++) {
      const cx = r2(gx * step + pick(0.15, 0.85) * step);
      const cy = r2(gy * step + pick(0.15, 0.85) * step);
      const rr = r2(pick(6, 34));
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="hsl(${r2(hue())} 80% ${r2(pick(52, 84))}%)" opacity="${r2(pick(0.25, 0.75))}"/>`
      );
      if (rand() < 0.35) {
        const len = r2(pick(40, 130));
        parts.push(
          `<rect x="${cx}" y="${cy}" width="${len}" height="${r2(pick(3, 9))}" transform="rotate(${r2(pick(0, 180))} ${cx} ${cy})" fill="${story.light}" opacity="${r2(pick(0.14, 0.4))}"/>`
        );
      }
    }
  }

  // --- vignette ---------------------------------------------------------
  parts.push(`<rect width="${SIZE}" height="${SIZE}" fill="url(#vig${index})"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <defs>
    <linearGradient id="bg${index}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${story.dark}"/>
      <stop offset="55%" stop-color="hsl(${hueA} 55% 28%)"/>
      <stop offset="100%" stop-color="${story.light}"/>
    </linearGradient>
    <radialGradient id="vig${index}" cx="50%" cy="45%" r="72%">
      <stop offset="60%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
    </radialGradient>
  </defs>
  ${parts.join('\n  ')}
</svg>
`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let bytes = 0;
for (const [i, story] of STORIES.entries()) {
  const svg = build(story, i);
  fs.writeFileSync(path.join(OUT_DIR, story.file), svg, 'utf8');
  bytes += Buffer.byteLength(svg);
  process.stdout.write(`  ${story.file}  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB\n`);
}

console.log(
  `\nGenerated ${STORIES.length} placeholder illustrations (${(bytes / 1024).toFixed(0)} KB total) in public/stories/`
);
