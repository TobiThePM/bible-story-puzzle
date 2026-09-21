import type { GameMode, GridSize, ModeId, SessionLength } from '@/types';

/**
 * Difficulty levels.
 *
 * Every number here is configuration, deliberately NOT hardcoded anywhere else.
 * After playtesting with real children, tune this file and nothing else.
 *
 * Difficulty is raised in three ways, in this order of preference:
 *   1. bigger grid   (3x3 = 9 tiles -> 4x4 = 16 -> 5x5 = 25)
 *   2. tighter clock
 *   3. removing the Peek safety net
 *
 * `progress` runs 0 (first round) to 1 (last round) whatever the session
 * length, so a 5-puzzle game ramps through the same difficulty arc as a
 * 20-puzzle one rather than never leaving the opening grid.
 */
export const MODES: Record<ModeId, GameMode> = {
  'little-ones': {
    id: 'little-ones',
    label: 'Little Ones',
    tagline: 'Ages 4-7',
    description: 'Small 3x3 pictures, a generous clock, and free peeks. Nobody loses points.',
    gridFor: () => 3,
    secondsFor: () => 90,
    peekEnabled: true,
    peekPenalty: 0,
    peekSeconds: 3,
    storyCardSeconds: 8,
  },

  standard: {
    id: 'standard',
    label: 'Standard',
    tagline: 'Ages 8+',
    description: 'Starts at 3x3 and grows to 4x4. Peeks cost 25 points.',
    gridFor: (progress) => (progress < 0.3 ? 3 : 4),
    secondsFor: (_progress, grid) => (grid === 3 ? 45 : 60),
    peekEnabled: true,
    peekPenalty: 25,
    peekSeconds: 2.5,
    storyCardSeconds: 6,
  },

  champion: {
    id: 'champion',
    label: 'Champion',
    tagline: 'Youth groups',
    description: 'Straight to 4x4 with a tight clock. No peeking.',
    gridFor: (progress) => (progress < 0.15 ? 3 : 4),
    secondsFor: (_progress, grid) => (grid === 3 ? 30 : 40),
    peekEnabled: false,
    peekPenalty: 0,
    peekSeconds: 0,
    storyCardSeconds: 6,
  },

  master: {
    id: 'master',
    label: 'Master',
    tagline: 'Adults, and show-offs',
    description: '4x4 rising to a brutal 5x5. No peeking, no mercy.',
    gridFor: (progress) => (progress < 0.4 ? 4 : 5),
    secondsFor: (_progress, grid) => (grid === 4 ? 35 : 55),
    peekEnabled: false,
    peekPenalty: 0,
    peekSeconds: 0,
    storyCardSeconds: 6,
  },
};

/** Display order on the mode-select screen: easiest first. */
export const MODE_ORDER: ModeId[] = ['little-ones', 'standard', 'champion', 'master'];

export const DEFAULT_MODE: ModeId = 'standard';

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
 * Twenty rounds is a ~20 minute commitment - great for a Sunday school slot,
 * too long for "one more go". Short games exist so a win is reachable.
 */
export const LENGTHS: LengthOption[] = [
  { rounds: 5, label: 'Quick', blurb: 'Five puzzles', minutes: '~5 min' },
  { rounds: 10, label: 'Half', blurb: 'Ten puzzles', minutes: '~10 min' },
  { rounds: 20, label: 'Full', blurb: 'All twenty, Genesis to Jeremiah', minutes: '~20 min' },
];

export const DEFAULT_LENGTH: SessionLength = 10;

export function isSessionLength(n: number): n is SessionLength {
  return LENGTHS.some((l) => l.rounds === n);
}
