import type { GameMode, GridSize, ModeId } from '@/types';

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
    gridFor: (round) => (round < 6 ? 3 : 4),
    secondsFor: (_round, grid) => (grid === 3 ? 45 : 60),
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
    gridFor: (round) => (round < 3 ? 3 : 4),
    secondsFor: (_round, grid) => (grid === 3 ? 30 : 40),
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
    gridFor: (round) => (round < 8 ? 4 : 5),
    secondsFor: (_round, grid) => (grid === 4 ? 35 : 55),
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
