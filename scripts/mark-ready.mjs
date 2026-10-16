/**
 * Flip stories from written to playable.
 *
 *   node scripts/mark-ready.mjs garden-of-eden rainbow-promise
 *   node scripts/mark-ready.mjs --auto
 *
 * A story is `ready: false` while it has text but no illustration, which is
 * what keeps main shippable during an art run. This flips the flag, but only
 * once both image files actually exist - so the flag can never lie.
 *
 * `--auto` marks every story whose images are present.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORIES = path.resolve(__dirname, '../src/content/stories.ts');
const PUBLIC = path.resolve(__dirname, '../public');

const args = process.argv.slice(2);
const auto = args.includes('--auto');
const wanted = new Set(args.filter((a) => !a.startsWith('--')));

let src = fs.readFileSync(STORIES, 'utf8');

// Split into entries so each story can be inspected on its own.
const parts = src.split('\n  {\n');
const head = parts.shift();

const marked = [];
const missing = [];

const rebuilt = parts.map((block) => {
  const id = block.match(/id: '([^']+)'/)?.[1];
  const image = block.match(/image: '([^']+)'/)?.[1];
  const thumb = block.match(/thumb: '([^']+)'/)?.[1];
  if (!id || !image || !thumb) return block;

  const alreadyReady = /ready: true,/.test(block);
  const targeted = auto || wanted.has(id);
  if (!targeted || alreadyReady) return block;

  const haveBoth =
    fs.existsSync(path.join(PUBLIC, image)) && fs.existsSync(path.join(PUBLIC, thumb));

  if (!haveBoth) {
    if (!auto) missing.push(id);
    return block;
  }

  marked.push(id);
  return block.replace('ready: false,', 'ready: true,');
});

src = head + '\n  {\n' + rebuilt.join('\n  {\n');
fs.writeFileSync(STORIES, src);

const total = (src.match(/ready: true,/g) || []).length;
const pending = (src.match(/ready: false,/g) || []).length;

if (marked.length) console.log(`marked ready: ${marked.join(', ')}`);
if (missing.length) {
  console.log(`NOT marked - images missing: ${missing.join(', ')}`);
}
console.log(`\nplayable: ${total}   awaiting art: ${pending}   total: ${total + pending}`);
