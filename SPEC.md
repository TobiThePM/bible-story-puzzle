# Bible Story Puzzle Quest — Product & Build Specification

**Working title:** Bible Story Puzzle Quest *(name not final — alternatives: Scripture Scramble, Twenty Wonders, The Story Board)*
**Version:** 1.0 spec
**Status:** Ready to build
**Date:** 21 September 2026

---

## 1. What this is, in one paragraph

A fast, timed picture-puzzle game that walks a player through twenty of the Bible's most dramatic stories, **in biblical order**. Each round shows a scrambled illustration of one story. The player has a limited time to drag the tiles back into place. The moment the picture is whole, the story behind it appears — a scripture reference and one or two sentences — then the next round begins. At the end there is a score, a rank, and a record of which twenty stories they just travelled through. It runs in a browser on any phone, tablet or projector, and needs no install and no login.

**The single most important design idea:** the puzzle is the hook; the story card after each puzzle is the point. The game is a delivery mechanism for twenty pieces of scripture, ordered so that playing it once is a guided tour of the Bible's narrative spine. That is what makes it usable in a Sunday school rather than just fun.

---

## 2. Who it is for

| Audience | How they use it | What they need from it |
|---|---|---|
| **Children, 6–12** | Play solo on a tablet or phone | Fun first. Forgiving. No reading required to play. |
| **Sunday school teachers** | Project on a screen, class plays together or takes turns | Zero setup. No login. Works on bad wifi. Story cards they can pause on and talk about. |
| **Parents** | Hand the phone over on a Sunday afternoon | Safe. No ads. No data collection. No chat with strangers. |
| **Youth groups / church events** | Competitive play, eventually multiplayer | Scores, ranks, a winner. |

**Reading level:** all story text written for a 9-year-old. Puzzle play itself requires no reading at all.

---

## 3. The twenty stories

These are the twenty levels, in canonical order. Playing the full game is a walk from Genesis to the prophets. This ordering is deliberate and is itself a teaching device — do not shuffle the story order.

| # | Story | Reference | Grid | What the image shows |
|---|---|---|---|---|
| 1 | Creation — light over the waters | Genesis 1:1–5 | 3×3 | Light breaking across a dark sea, sky splitting open |
| 2 | Noah and the ark | Genesis 7:11–24 | 3×3 | The ark on high water, animals at the rail, storm behind |
| 3 | The Tower of Babel | Genesis 11:1–9 | 3×3 | A vast unfinished tower, scaffolding, people scattering |
| 4 | Abraham and the stars | Genesis 15:1–6 | 3×3 | An old man under an enormous field of stars |
| 5 | Joseph's coat | Genesis 37:3–28 | 3×3 | A brightly striped coat, brothers, a distant caravan |
| 6 | The burning bush | Exodus 3:1–6 | 3×3 | A bush wrapped in flame, unburnt, a figure barefoot |
| 7 | The night of the Passover | Exodus 12:21–30 | 4×4 | Doorposts marked, a dark street, lamplight in windows |
| 8 | Crossing the Red Sea | Exodus 14:21–31 | 4×4 | Two walls of water, a dry path, a crowd walking through |
| 9 | The Ten Commandments | Exodus 19:16–20:17 | 4×4 | Mount Sinai in smoke and lightning, stone tablets |
| 10 | The walls of Jericho | Joshua 6:12–20 | 4×4 | Massive walls collapsing, trumpets, marching ranks |
| 11 | Gideon's three hundred | Judges 7:16–22 | 4×4 | Torches inside clay jars, night, a hillside of lights |
| 12 | Samson and the pillars | Judges 16:23–30 | 4×4 | A temple's great pillars buckling, a strong figure between |
| 13 | David and Goliath | 1 Samuel 17:38–51 | 4×4 | A boy with a sling facing an enormous armoured giant |
| 14 | Solomon builds the temple | 1 Kings 6:1–14 | 4×4 | Golden temple under construction, cedar, stonemasons |
| 15 | Fire on Mount Carmel | 1 Kings 18:30–39 | 4×4 | Fire falling on a drenched altar, a crowd falling back |
| 16 | The chariots of fire | 2 Kings 6:15–17 | 4×4 | A hillside full of burning chariots and horses of light |
| 17 | The fiery furnace | Daniel 3:19–27 | 4×4 | Three figures unharmed in a white-hot furnace, a fourth |
| 18 | Daniel in the lions' den | Daniel 6:16–23 | 4×4 | A stone pit, lions calm, a man standing, dawn light above |
| 19 | Jonah and the great fish | Jonah 1:15–2:10 | 4×4 | A vast fish beneath a storming sea, a figure falling |
| 20 | The potter's house | Jeremiah 18:1–6 | 4×4 | Hands at a wheel reshaping a marred vessel, warm workshop |

**Content note:** every story is told as wonder, rescue and the power of God. Violence is implied by composition, never depicted graphically — Goliath falls, blood is never shown. The Passover image shows marked doorposts and lamplight, not death. This is a children's product and the art direction enforces it.

---

## 4. Core game loop

```
HOME
  └─> choose mode (Little Ones / Standard / Champion)
        └─> ROUND INTRO      3s   "Round 4 of 20"  + story title
              └─> PLAY       timed, drag tiles to swap
                    ├─ solved before timer ends  ──┐
                    └─ timer reaches zero       ──┤
                                                  v
                          STORY CARD   6s (or tap to continue)
                          full image, title, reference, 1–2 sentences
                                                  │
                          ┌───────────────────────┘
                          v
                  round < 20 ? next ROUND INTRO : RESULTS
RESULTS
  final score, rank, per-round breakdown, list of all 20 stories visited
  └─> Play again  |  Review the stories  |  Share score
```

The loop never stops for failure. A timed-out round still shows the story card and still scores partial credit. **A child who solves nothing still sees all twenty stories.** This is intentional.

---

## 5. The puzzle mechanic — exact rules

**Type:** drag-and-swap grid. The image is cut into an N×N grid of square tiles. Tiles are shuffled. The player drags any tile onto any other tile and the two exchange positions. When every tile is in its home position, the round is solved.

Chosen over sliding-tile (15-puzzle) because a 4×4 slider takes minutes, not seconds, and would fight the timer. Chosen over loose-piece jigsaw because irregular pieces are fiddly on a phone.

**Interaction:**
- **Touch:** press and hold a tile (80ms) to lift it, drag over a target, release to swap. Tile follows the finger with a slight lift shadow and 1.05 scale.
- **Mouse:** click-drag, identical behaviour. Also supports click-tile-A-then-click-tile-B as a fallback.
- **Keyboard:** arrow keys move a focus ring; `Space` or `Enter` picks up; arrows move to a target; `Space` again swaps. `Escape` cancels a pickup.
- **Snap:** the drop target is whichever tile's centre is nearest the pointer on release, within the grid bounds. Release outside the grid cancels the drag, no penalty.
- **Animation:** swaps animate over 180ms with an ease-out curve. Correct placements pulse once. Never block input during animation — queue it.

**Shuffle rules (important):**
- Any permutation is solvable in a swap puzzle, so no parity check is needed — but the shuffle must not be accidentally easy.
- **Constraint:** at least 80% of tiles must start out of their home position, and no more than two tiles may start adjacent to their correct neighbours in the correct orientation.
- The shuffle is produced from a **seeded pseudo-random generator**. Seed = `${storyId}-${sessionSeed}`. This makes runs reproducible for testing and — critically — lets Phase 2 multiplayer give every player in a room the *identical* shuffle, so the race is fair.

**Peek:** a button showing the complete image for 2.5 seconds. Costs 25 points, unlimited uses, disabled in Champion mode, free and unlimited in Little Ones mode. The timer keeps running during a peek.

---

## 6. Difficulty, timing and modes

The originally imagined 20-second timer is too tight for a 4×4 grid — a competent adult needs roughly 35–50 seconds. Recommended values below; all are configuration, not hardcoded, so they can be tuned after playtesting with real children.

| Mode | Grid | Time per round | Peek | Penalties | Intended for |
|---|---|---|---|---|---|
| **Little Ones** | 3×3 all 20 rounds | 90s | Free, unlimited | None | Ages 4–7, or first play |
| **Standard** | 3×3 rounds 1–6, 4×4 rounds 7–20 | 45s (3×3) / 60s (4×4) | −25 pts | Standard | Default. Ages 8+ |
| **Champion** | 3×3 rounds 1–3, 4×4 rounds 4–20 | 30s (3×3) / 40s (4×4) | Disabled | Standard | Youth groups, competition |

**Timer behaviour:** a ring or bar, not a number alone — young children read depletion faster than digits. Turns amber at 40% remaining, red at 15%, with a soft pulse. No harsh alarm sound; this will be played in quiet rooms.

**Full-run length:** Standard mode runs roughly 18–22 minutes including story cards. This is deliberately sized to fit a Sunday school slot.

---

## 7. Scoring

Per round:

```
completionPoints  = solved ? 100 : 0
partialPoints     = solved ? 0   : round(60 * correctlyPlacedTiles / totalTiles)
timeBonus         = solved ? secondsRemaining * 5 : 0
peekPenalty       = peeksUsed * 25          (0 in Little Ones mode)
goldStarBonus     = (solved && peeksUsed == 0 && secondsUsed <= timeLimit/2) ? 50 : 0

roundScore = max(0, completionPoints + partialPoints + timeBonus - peekPenalty + goldStarBonus)
```

Final score is the sum of twenty rounds. Maximum achievable in Standard is roughly 7,400.

**Ranks** (shown on the results screen, tuned to Standard mode):

| Score | Rank |
|---|---|
| 0 – 1,499 | Seeker |
| 1,500 – 2,999 | Student |
| 3,000 – 4,499 | Scribe |
| 4,500 – 5,999 | Watchman |
| 6,000 – 6,999 | Champion |
| 7,000+ | Faithful Witness |

**Gold stars** are tracked separately and displayed as a count out of 20 — a second, purer goal for repeat players that isn't inflated by mode choice.

---

## 8. Screens

### 8.1 Home
Title, a single large **Play** button, mode selector, and a quiet secondary row: *Story Library*, *How to play*, *Best score*. Best score and gold-star count read from local storage. No account, no email field, nothing to dismiss.

### 8.2 Round intro (3 seconds, skippable by tap)
Large round counter `4 / 20`, the story title, and a progress rail of 20 dots showing where they are. No image preview — the picture is the puzzle.

### 8.3 Play
The grid fills the available space, centred, square, capped at 640px. Above it: round counter, timer ring, running score. Below it: Peek button. Nothing else. On a phone in portrait the grid should occupy at least 70% of viewport height.

### 8.4 Story card
Full assembled image at the top, then:
- **Title** — e.g. "The Walls of Jericho"
- **Reference** — e.g. "Joshua 6:12–20"
- **Retelling** — 1–2 sentences, under 220 characters
- **Verse** — one short quoted verse, under 140 characters

Auto-advances after 6 seconds with a visible progress line, or tap to continue. **Teachers must be able to hold this screen** — a pause control freezes the auto-advance so a class can talk about it. This is the single most important affordance for classroom use.

### 8.5 Results
Final score, rank badge, gold stars out of 20, and a scrollable per-round breakdown (thumbnail, title, solved/timed-out, points). Then a **Story Library** link listing all twenty with references, so the run can be revisited as a reading plan. Buttons: *Play again*, *Try Champion mode*, *Share score* (copies a text summary to clipboard — no social SDK, no tracking).

### 8.6 Story Library (standalone)
All twenty stories, full images, references, retellings, verses — browsable outside of play. Free to use as a teaching resource without playing the game at all.

---

## 9. Content data contract

**This section is the antidote to what went wrong last time.** Every piece of story content lives in exactly one file. No story text, image path, reference or timing value appears anywhere else in the codebase. Components receive story objects as props; they never reach for content themselves.

`src/content/stories.ts`

```ts
export interface Story {
  id: string;              // stable kebab-case slug, never reused, never renamed
  order: number;           // 1-20, canonical biblical order
  title: string;           // "The Walls of Jericho"
  reference: string;       // "Joshua 6:12-20"
  retelling: string;       // <= 220 chars, reading age 9
  verse: string;           // <= 140 chars, quoted
  verseReference: string;  // "Joshua 6:20"
  image: string;           // "/stories/10-jericho.webp"  1200x1200
  thumb: string;           // "/stories/10-jericho-thumb.webp"  240x240
  alt: string;             // description for screen readers
  defaultGrid: 3 | 4;      // baseline difficulty; mode config may override
}

export const STORIES: Story[] = [ /* exactly 20, ordered */ ];
```

`src/content/modes.ts`

```ts
export interface GameMode {
  id: 'little-ones' | 'standard' | 'champion';
  label: string;
  description: string;
  gridFor: (round: number) => 3 | 4;
  secondsFor: (round: number, grid: 3 | 4) => number;
  peekEnabled: boolean;
  peekPenalty: number;
  storyCardSeconds: number;
}
```

**Rules that must hold:**
1. `STORIES.length === 20` — enforced by a unit test.
2. Every `id` is unique; every `order` is unique and covers 1–20 — enforced by a unit test.
3. Every `image` and `thumb` path resolves to a real file — enforced by a build-time check.
4. Adding a 21st story requires touching **one file plus two image files**. Nothing else.

---

## 10. Game state machine

State is explicit and centralised. No round logic lives inside components.

```
idle ──play──> briefing ──(3s)──> playing
                                    ├──all tiles home──> solved
                                    └──timer == 0──────> timedOut
solved ─┐
timedOut┴──> storyCard ──(6s or tap)──> round<20 ? briefing : results
results ──play again──> idle
```

`src/game/store.ts` (Zustand) holds:

```ts
interface GameState {
  phase: 'idle'|'briefing'|'playing'|'solved'|'timedOut'|'storyCard'|'results';
  mode: GameMode;
  roundIndex: number;        // 0-19
  tiles: number[];           // current position -> home index
  grid: 3 | 4;
  secondsRemaining: number;
  peeksUsedThisRound: number;
  roundResults: RoundResult[];
  sessionSeed: string;
  totalScore: number;        // derived, never written directly
}
```

Pure functions, unit-testable in isolation, no React:
- `shuffle(grid, seed): number[]`
- `isSolved(tiles): boolean`
- `correctCount(tiles): number`
- `swap(tiles, a, b): number[]`
- `scoreRound(input: RoundScoreInput): RoundResult`

**Rule:** the timer is driven by a single `requestAnimationFrame` loop reading wall-clock time, not by `setInterval` incrementing a counter — background tabs and slow phones otherwise drift badly.

---

## 11. Technical specification

**Stack**
- Next.js 15 (App Router), TypeScript strict mode
- Tailwind CSS
- Zustand for game state
- `@dnd-kit/core` for drag and drop — chosen for solid touch and keyboard support
- `framer-motion` for tile swap animation
- No backend in v1. No database. No authentication.
- Deployed to Vercel, single production branch

**Storage:** `localStorage` only — best score per mode, gold star count, last completed run, chosen mode, reduced-motion preference. Namespaced under `bpq.v1.*`. Never store a name, email, or anything identifying.

**Assets:** WebP, 1200×1200 source, 240×240 thumbnail, served through `next/image`. All twenty committed to the repository — not fetched from an external CDN, not generated at runtime. Total asset budget under 6 MB.

**Performance targets:** first contentful paint under 1.5s on a mid-range Android over 4G; tile drag holds 60fps on a 2019-era phone; the whole game playable offline after first load (Phase 1.5 service worker, optional).

**Project structure**

```
src/
  app/
    page.tsx                 home
    play/page.tsx            game host, renders by phase
    library/page.tsx         story library
    layout.tsx
  components/
    PuzzleGrid.tsx           the board
    PuzzleTile.tsx           one tile
    TimerRing.tsx
    StoryCard.tsx
    RoundIntro.tsx
    ResultsScreen.tsx
    ModeSelect.tsx
  game/
    store.ts                 Zustand store + phase transitions
    logic.ts                 pure: shuffle, swap, isSolved, correctCount
    scoring.ts               pure: scoreRound, rankFor
    rng.ts                   seeded PRNG (mulberry32)
    useTimer.ts              rAF wall-clock timer hook
  content/
    stories.ts               THE twenty stories - single source of truth
    modes.ts                 mode configuration
  types/
    index.ts
public/
  stories/                   40 image files (20 full + 20 thumb)
tests/
  logic.test.ts
  scoring.test.ts
  content.test.ts            asserts 20 stories, unique ids, files exist
```

---

## 12. Art direction for the twenty images

The images are the product. Getting them wrong makes the game unplayable regardless of code quality.

**Style:** one consistent illustrated style across all twenty — painterly, warm, cinematic, storybook rather than photoreal. Same palette family, same light quality, same level of detail. A player must recognise them as a set.

**Hard constraints, because the image gets cut into 16 pieces:**
- **Square, 1:1, 1200×1200.** Non-negotiable — the grid is square.
- **No large flat regions.** A quarter-frame of featureless blue sky produces four identical tiles and an unsolvable puzzle. Every region needs texture, gradient or detail.
- **High local contrast.** Adjacent tiles must be visibly different from each other.
- **Strong central focal point**, with supporting detail spread to the corners — not a blank border.
- **No text, no lettering, no numerals** anywhere in the image. It fragments into nonsense and blocks translation later.
- **Readable at 300px wide**, since that's the real size on a phone.
- **Child-appropriate:** awe and rescue, never gore, never terror.

**Process:** generate, then *test each image by actually cutting it into a 4×4 grid and checking no two tiles are confusable*. Reject and regenerate any image that fails. Budget for regenerating roughly a third of them.

---

## 12A. How the image actually works — generated once, stored, never regenerated

**This is the most important technical clarification in the spec.** Get it wrong and the game is slow, expensive and fragile. Get it right and it is free to run forever.

### The images are files, created once, before launch

The twenty illustrations are generated **once**, by hand, during production — not at runtime, not per player, not per round. Each is exported as a file, committed to the repository, and served like any other image on any website.

```
public/stories/01-creation.webp        1200x1200   generated once, ~180 KB
public/stories/01-creation-thumb.webp   240x240    generated once, ~12 KB
... twenty pairs ...
```

At runtime the game calls **no AI API, ever**. There is no image generation in the shipped product. There is no key, no quota, no per-player cost, no latency. A player's browser downloads a static file — exactly as it would download a logo.

Once the twenty images are final, the AI's involvement in this project is over.

### The image is never cut into pieces

This is the part that trips people up. A 4×4 puzzle does **not** mean sixteen image files. It means **one** image file, displayed through sixteen windows.

Each tile is an empty HTML element whose background is the *same whole image*, offset so that only one sixteenth of it shows through:

```css
.tile {
  width: 120px;
  height: 120px;
  background-image: url('/stories/10-jericho.webp');
  background-size: 480px 480px;   /* the whole image, scaled to board size */
}
```

```ts
// tile at screen position `pos` is currently showing home-piece `home`
const col = home % grid;
const row = Math.floor(home / grid);
const size = boardPx / grid;

style.backgroundPosition = `-${col * size}px -${row * size}px`;
```

**Scrambling** = shuffling which sixteenth each window shows.
**Solving** = every window showing its correct sixteenth.

When solved, the sixteen windows sit edge to edge showing consecutive regions of the same file — so the board *is* the original picture, pixel for pixel. Nothing is stitched, merged, saved or reassembled. It simply lines up. That is exactly the behaviour you described: what you see when it clicks into place is the image that was already saved.

### Why this approach and not sixteen files

| | One file, CSS offsets | Sixteen cropped files |
|---|---|---|
| Network requests per round | **1** | 16 |
| Files in the repo | 40 | 340 |
| Changing to a 3×3 grid | change one number | re-cut every image |
| Seams between tiles | none | rounding gaps |
| Adding a story | 2 files | 33 files |

There is no version of this where cutting the images is better.

### Loading and caching

- The browser downloads each story image **once per session**, then caches it. Replaying round 10 costs nothing.
- **Preload the next round's image during the story card**, so the next puzzle never waits on a download. The story card is a 6-second window — plenty.
- Preload rounds 1–3 on the home screen while the player is choosing a mode.
- Total payload across all twenty rounds stays under 6 MB — comparable to a couple of photos, and the game is playable offline after a first full run.

### How the game knows it's solved

Not by comparing pixels. Never by comparing pixels.

Game state is a plain array of numbers: `tiles[screenPosition] = homePieceIndex`. A solved board is simply every number sitting in its own slot:

```ts
const isSolved = (tiles: number[]) => tiles.every((home, pos) => home === pos);
```

That check is instant, runs on every swap, and involves no image processing whatsoever. The picture looking correct is a *consequence* of the array being correct — not something the game measures.

### Practical production notes

- Generate at 1200×1200, export WebP at quality 82. Keep the original PNGs in a separate `assets-source/` folder outside `public/` for future re-export; don't ship them.
- Name files `NN-slug.webp` matching the story `order` and `id`. Never rename once shipped.
- Run the 4×4 confusable-tile check in §12 on each image **before** committing it.
- If an image is ever regenerated, keep the same filename so nothing else has to change.

---

## 13. Accessibility and classroom realities

- **Keyboard-complete.** The entire game is playable without a pointer.
- **Screen reader:** each tile announces "tile 7, row 2 column 3"; the board announces correct-count changes politely; story cards read title, reference and retelling.
- **Tap targets:** every tile at least 48×48 CSS pixels at the smallest supported grid on the smallest supported phone (360px wide). A 4×4 grid at 320px board width gives 80px tiles — comfortable.
- **Reduced motion:** `prefers-reduced-motion` removes swap animation and pulsing; swaps become instant.
- **Colour:** no game information conveyed by colour alone. The timer uses both colour and depletion.
- **Contrast:** all text meets WCAG AA against its background.
- **Audio is optional and off by default.** The game must be fully playable silent — it will be played in classrooms and in the back of church.
- **Projector mode:** a large-display layout where the grid and text scale up for a room; consider a `?display=large` query flag.
- **Offline tolerance:** church wifi is bad. Assets are local, no runtime network calls are required after load.

**Privacy — a hard requirement, not a nicety.** This is a children's product. v1 collects nothing: no accounts, no emails, no names sent anywhere, no analytics SDK, no ads, no third-party scripts, no chat. Nicknames in Phase 2 stay inside a room and are never persisted server-side beyond the session. State this plainly on the home screen.

---

## 14. Phase 2 — multiplayer (specified, not built in v1)

v1 must not paint this into a corner. The architecture decisions below are what make Phase 2 additive rather than a rewrite.

**What v1 must already do to stay multiplayer-ready:**
1. Shuffle from a **seed**, so all players can receive an identical board.
2. Keep all round logic in **pure functions** that take state and return state — a server can run the identical functions.
3. Keep scoring pure and deterministic.
4. Never let a component own game truth; the store is the only authority.

**Phase 2 shape:**
- **Host** opens a room on a laptop or projector and gets a 5-character room code.
- **Players** join at the same URL by entering the code and a nickname. No account.
- Host starts; all players receive the same `sessionSeed`, so every board in the room is identical.
- Everyone races the same round simultaneously. Server records finish time and score per player.
- Between rounds the host screen shows a live leaderboard; player devices show their own placing.
- After round 20, a podium.
- Room sizes to 40 players.

**Likely stack:** Supabase (Postgres + Realtime) or Ably/Pusher for socket transport. Rooms are ephemeral — deleted within 24 hours. Nicknames are filtered against a profanity list and never joined to any identity.

**Phase 3 candidates, explicitly out of scope for now:** teacher accounts with class results, custom story packs, additional languages, a New Testament set of twenty, printable worksheets keyed to each story.

---

## 15. Non-goals for v1

State these so scope creep has somewhere to bounce off:
- No accounts, no login, no cloud save
- No multiplayer
- No sound design beyond optional simple cues
- No animations beyond tile swap and screen transitions
- No CMS — content is a TypeScript file
- No internationalisation (but no text baked into images, so it stays possible)
- No ads, no monetisation, no analytics
- No New Testament stories — that is a second pack, later

---

## 16. Definition of done for v1

The build is complete when all of the following are true:

1. Twenty stories load from `stories.ts`, in canonical order, with twenty matching image pairs committed.
2. All three modes are playable start to finish on a phone, a tablet and a desktop browser.
3. A full Standard run of twenty rounds completes without a crash, a stuck timer, or a dropped tile.
4. Every round can be solved by drag, by click-click, and by keyboard alone.
5. Timing out advances correctly, shows the story card, and awards partial credit.
6. Scores match the formula in §7 — verified by unit tests on `scoreRound`.
7. Shuffle passes the 80%-displacement constraint on 1,000 seeded runs — verified by test.
8. Best score and gold stars persist across a browser restart.
9. Story cards can be paused by a teacher and held indefinitely.
10. Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on mobile.
11. No network requests to any third-party domain at runtime. Verified in the network tab.
12. Every one of the twenty images passes the 4×4 confusable-tile check.

---

## 17. Why the last attempt scattered, and the rules that prevent it

The previous version worked and then fell apart. That is almost always structural, not a coding failure. These rules are part of the spec:

1. **One source of truth for content.** All story data in `src/content/stories.ts`. If a title, verse or image path appears in a component, that is a bug.
2. **Pure logic, separated from React.** `shuffle`, `swap`, `isSolved`, `scoreRound` are pure functions with tests. They cannot break from a UI change.
3. **Assets live in the repository.** No external image hosting, no hotlinks, no Google Drive. If it isn't committed, it will disappear.
4. **One branch deploys.** `main` → Vercel production. No manual uploads, no "the working version is on my laptop."
5. **Tests guard the content contract.** Twenty stories, unique ids, files exist. A broken content file fails the build instead of shipping.
6. **Config over constants.** Timers, grid sizes and penalties live in `modes.ts`, not scattered through components as magic numbers.
7. **Commit after every working round of work**, with the deployed URL noted in the README.

---

## 18. Suggested build order

1. Content file with all twenty entries — text first, placeholder images
2. Pure logic + tests: `rng`, `shuffle`, `swap`, `isSolved`, `correctCount`
3. Scoring + tests
4. `PuzzleGrid` with drag-and-swap, hardcoded to one image, no timer
5. Timer and the phase state machine
6. Round intro → play → story card → results, wired end to end
7. Modes and mode select
8. Local storage persistence
9. Real images, one at a time, each tested for confusable tiles
10. Accessibility pass: keyboard, screen reader, reduced motion, contrast
11. Polish: animation, timer ring, rank badges, story library
12. Deploy, then playtest with actual children and tune the timers

Steps 1–8 are a working game with placeholder art. Get there first.
