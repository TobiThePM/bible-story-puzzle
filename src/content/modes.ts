import type { GameMode, GridSize, ModeId, SessionLength } from '@/types';

/**
 * THREE LEVELS.
 *
 * v2 replaced four age-labelled modes ("Little Ones, Ages 4-7") with three
 * named by intensity. Adults were the first testers and the age labels read as
 * childish; worse, only the two easiest were playable at all.
 *
 * TIMING IS THE HEADLINE FIX. Testers said they could not make sense of a
 * scrambled picture before the clock ran out. Three changes address that:
 *
 *   1. Every clock is far longer, and bigger grids get disproportionately more
 *      time - a 5x5 is not 1.5x harder than a 4x4, it is roughly 3x harder.
 *   2. Every round now opens with a free look at the finished picture
 *      (previewSeconds), like the lid of a jigsaw box.
 *   3. Peek is available on ALL levels. Previously the two hardest disabled it,
 *      which removed the only safety net exactly where it was needed most.
 *
 * Every number here is configuration. After playtesting, tune this file and
 * nothing else.
 */
export const MODES: Record<ModeId, GameMode> = {
  'still-waters': {
    id: 'still-waters',
    label: 'Still Waters',
    tagline: 'Easy',
    description: '3×3 pictures, an unhurried clock, and free peeks. Nothing is taken away.',
    pool: 'one',
    gridFor: () => 3,
    secondsFor: () => 90,
    previewSeconds: 4,
    peekEnabled: true,
    peekPenalty: 0,
    peekSeconds: 3,
    storyCardSeconds: 8,
  },

  'rising-tide': {
    id: 'rising-tide',
    label: 'Rising Tide',
    tagline: 'Intermediate',
    description: 'Starts at 3×3 and grows to 4×4. Room to think. Peeks cost 25.',
    pool: 'two',
    // was 45s / 60s in v1 - testers could not finish a 4x4 in 60s
    gridFor: (progress) => (progress < 0.3 ? 3 : 4),
    secondsFor: (_progress, grid) => (grid === 3 ? 60 : 100),
    previewSeconds: 3,
    peekEnabled: true,
    peekPenalty: 25,
    peekSeconds: 2.5,
    storyCardSeconds: 6,
  },

  'refiners-fire': {
    id: 'refiners-fire',
    label: "Refiner's Fire",
    tagline: 'Hard',
    description: 'Every picture at 4×4, on a tighter clock. Hard, but never unfair. Peeks cost 40.',
    pool: 'three',
    // 5x5 was removed in v2.1: 25 tiles on a phone made pieces too small to
    // read and the round too long. Hard now means a full 4x4 every round on a
    // tighter clock than Rising Tide, not a bigger grid.
    gridFor: () => 4,
    secondsFor: () => 75,
    previewSeconds: 2,
    peekEnabled: true,
    peekPenalty: 40,
    peekSeconds: 2,
    storyCardSeconds: 6,
  },
};

/** Display order on the level picker: easiest first. */
export const MODE_ORDER: ModeId[] = ['still-waters', 'rising-tide', 'refiners-fire'];

export const DEFAULT_MODE: ModeId = 'still-waters';

export function modeById(id: string): GameMode {
  return MODES[id as ModeId] ?? MODES[DEFAULT_MODE];
}

export function tilesFor(grid: GridSize): number {
  return grid * grid;
}

// ---------------------------------------------------------------------------
// Session length
// ---------------------------------------------------------------------------

export interface LengthOption {
  rounds: SessionLength;
  label: string;
  blurb: string;
  /** Rough minutes including story cards, for the picker. */
  minutes: string;
}

/**
 * Twenty puzzles is a long sitting - right for a Sunday school slot, too long
 * for "one more go". Short games exist so a win is reachable.
 *
 * Minutes below reflect the v2 clocks, which are considerably longer.
 */
export const LENGTHS: LengthOption[] = [
  { rounds: 5, label: 'Quick', blurb: 'Five puzzles', minutes: '5–10 min' },
  { rounds: 10, label: 'Half', blurb: 'Ten puzzles', minutes: '10–20 min' },
  { rounds: 20, label: 'Full', blurb: 'All twenty in the level', minutes: '20–40 min' },
];

export const DEFAULT_LENGTH: SessionLength = 10;

export function isSessionLength(n: number): n is SessionLength {
  return LENGTHS.some((l) => l.rounds === n);
}
