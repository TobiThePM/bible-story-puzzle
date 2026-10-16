# Bible Story Puzzle

**Discover Scripture through some of the Bible's greatest stories.**

Timed picture puzzles - play 5, 10 or 20 - drawn from twenty Bible stories and
always presented in biblical order.
Solve the picture, read the story, move on. Built for Sunday schools, classrooms,
families and youth groups.

- **Live site:** <https://bible-story-puzzle.vercel.app>
- **Spec:** [SPEC.md](SPEC.md) · **Deployment guide:** [BUILD-AND-DEPLOY.md](BUILD-AND-DEPLOY.md)

---

## Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm test` | Unit tests (52) for puzzle logic, scoring, story selection and the content contract |
| `npm run build` | Static export into `out/` |
| `npm run placeholders` | Regenerates the 20 placeholder illustrations |
| `node scripts/process-art.mjs` | Optimises source art and runs the confusable-tile check |

---

## What matters about the architecture

**There is no AI in the finished game, and no backend.** AI wrote the code and
will generate the artwork; after that it is plain HTML, CSS and JavaScript. No
API calls, no keys, no per-player cost, no database. `npm run build` produces an
`out/` folder that can be hosted on Vercel, Netlify, Cloudflare, a $3 shared
host, or opened straight off a USB stick in a church with no internet.

**The images are never cut into pieces.** There is one image file per story. Each
tile is an empty box showing that whole image as its background, offset with CSS
percentages so only its own 1/Nth is visible. Solving the puzzle just lines the
offsets back up, so the finished board *is* the original picture, pixel for
pixel. One download per round instead of sixteen, no seams, and switching a round
from 4x4 to 5x5 is changing one number. See `src/components/PuzzleBoard.tsx`.

**Solving is an array check, never a pixel comparison:**
`tiles.every((piece, pos) => piece === pos)`.

**Content lives in exactly one file.** `src/content/stories.ts`. If a title,
verse, reference or image path ever appears inside a component, that is a bug.
Adding a 21st story is one entry plus one image file.

**Difficulty is configuration.** `src/content/modes.ts` holds all four levels.
After playtesting with real children, tune that file and nothing else.

---

## Session length

Twenty puzzles is a ~20 minute commitment - right for a Sunday school slot, too
long for "one more go". Three lengths are offered:

| Option | Puzzles | Roughly |
|---|---|---|
| **Quick** | 5 | 5 min |
| **Half** | 10 | 10 min |
| **Full** | 20 | 20 min, Genesis to Jeremiah |

A short game picks its stories **at random, then sorts them back into canonical
order** - so it is a different set every time, but still travels forwards
through the Bible rather than jumping about. Selection is seeded, so Phase 2
multiplayer can deal every player in a room the identical set.

Two things scale with length automatically:

- **Difficulty ramps on progress through the session, not on round number.** A
  five-puzzle Standard game still climbs 3x3 -> 4x4; it does not sit on the
  opening grid because the switch happened at round 6.
- **Ranks judge the average score per round, not the total.** A strong
  five-puzzle game can reach Faithful Witness. Under total-based thresholds it
  was capped at Student forever.

Best scores are stored per mode AND per length, so a 20-round total cannot
permanently outrank every 5-round game.

## Levels

| Level | Grid | Clock | Free look | Peek |
|---|---|---|---|---|
| **Still Waters** (Easy) | 3x3 throughout | 90s | 4s | Free |
| **Rising Tide** (Intermediate) | 3x3 -> 4x4 | 60s / 100s | 3s | -25 |
| **Refiner's Fire** (Hard) | 4x4 -> 5x5 | 90s / 150s | 2s | -40 |

v2 replaced four age-labelled modes with three named by intensity. Adults were
the first testers; the age labels read as childish and only the two easiest
modes were playable at all.

**Timing was the headline fix.** Testers could not make sense of a scrambled
picture before the clock ran out. Three changes address it:

1. Every clock is far longer, and bigger grids get disproportionately more time.
   A 5x5 is not 1.5x harder than a 4x4, it is roughly 3x harder.
2. Every round opens with a free look at the finished painting, like the lid of
   a jigsaw box. Harder levels get a shorter look.
3. Peek works on every level. v1 disabled it on the two hardest - removing the
   safety net exactly where it was needed most.

Tests in  enforce a floor of 3.5 seconds per tile on
every round of every level, and that a bigger grid always gets more time.

## Profiles

Players type a name and see their own best scores. Up to eight profiles share a
device, so a family or a class can pass one tablet around.

Still no accounts, no passwords, no server, no network calls. Names and scores
live in  and never leave the device - which is what keeps this
safe to hand to children without a privacy policy or consent machinery.

---

## Project layout

```
src/
  app/            home, /play, /library, global stylesheet
  components/     PuzzleBoard, TimerRing, StoryCard, RoundIntro, Results, GameHost
  content/        stories.ts (the 20 stories)  ·  modes.ts (difficulty)
  game/           logic.ts, scoring.ts, selection.ts, rng.ts, store.ts, useTimer.ts, storage.ts
  types/
public/stories/   20 illustrations
tests/            logic, scoring, selection, content-contract
scripts/          art pipeline + prompts + placeholder generator
```

`src/game/*.ts` (except the store and hooks) is pure and React-free, so it is
unit-testable in isolation — and so a Phase 2 multiplayer server can run the
identical functions.

---

## Privacy

No accounts, no login, no adverts, no analytics, no third-party scripts, no
network calls at runtime. Best scores live in `localStorage` on the player's own
device and never leave it. This is a children's product and it is built that way
on purpose.

---

## Before you launch

- [ ] **Proofread every verse against a printed Bible.** Quotations are King
      James Version (public domain) and were written from memory — they must be
      checked before this goes in front of a class.
- [x] ~~Replace the placeholder illustrations with real artwork.~~ Done — twenty
      Canva-generated paintings, 2.1 MB for the set.
- [ ] Improve the images that still fail the confusable-tile check. Run
      `node scripts/process-art.mjs` to see which. Currently **20/20 pass at
      3×3, 15/20 at 4×4, 8/20 at 5×5** — so Little Ones is clean, Standard has
      a few weak later rounds, and Master's 5×5 rounds need work.
- [ ] Playtest with real children and tune `src/content/modes.ts`.
- [x] ~~Add the live URL to the top of this file.~~ Done.

---

## Roadmap

**v1 (this):** single player, four difficulty levels, three session lengths
(5 / 10 / 20 puzzles), 20 stories, local scores.

**Phase 2 — multiplayer.** The groundwork is already here: boards are generated
from a seed, so every player in a room can be handed an identical puzzle, and all
round and scoring logic is pure. See [SPEC.md](SPEC.md) §14.

**Phase 3:** teacher accounts, a New Testament pack, other languages (no text is
baked into the images, so this stays possible), printable worksheets.
