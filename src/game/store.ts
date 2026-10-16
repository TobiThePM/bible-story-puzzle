'use client';

import { create } from 'zustand';
import type {
  GameMode,
  GridSize,
  ModeId,
  Phase,
  RoundResult,
  SessionLength,
  Story,
} from '@/types';
import { roundProgress } from '@/types';
import { MODES, DEFAULT_MODE, DEFAULT_LENGTH } from '@/content/modes';
import { boardSeed, correctCount, isSolved, shuffle, swap } from './logic';
import { pickStories, effectivePool } from './selection';
import { scoreRound, totalScore, goldStarCount } from './scoring';
import { makeSessionSeed } from './rng';
import { recordRun, setLastMode, setLastLength } from './storage';

/** How long the finished picture is held before the story card appears. */
export const SOLVE_CELEBRATION_MS = 900;

export interface GameState {
  phase: Phase;
  mode: GameMode;
  /** The stories this session plays, already in canonical order. */
  stories: Story[];
  roundIndex: number;
  tiles: number[];
  grid: GridSize;
  secondsLimit: number;
  secondsUsed: number;
  peeksUsed: number;
  peeking: boolean;
  storyCardPaused: boolean;
  results: RoundResult[];
  sessionSeed: string;
  newBest: boolean;
  /** Whose scores this run is recorded against. Empty means no profile. */
  profileId: string;

  startGame: (modeId: ModeId, length: number, profileId: string) => void;
  beginRound: () => void;
  swapTiles: (a: number, b: number) => void;
  tick: (secondsElapsed: number) => void;
  peek: () => void;
  endPeek: () => void;
  toggleStoryCardPause: () => void;
  finishRound: (solved: boolean) => void;
  advance: () => void;
  quit: () => void;
}

const initial = {
  phase: 'idle' as Phase,
  mode: MODES[DEFAULT_MODE],
  stories: [] as Story[],
  roundIndex: 0,
  tiles: [] as number[],
  grid: 3 as GridSize,
  secondsLimit: 0,
  secondsUsed: 0,
  peeksUsed: 0,
  peeking: false,
  storyCardPaused: false,
  results: [] as RoundResult[],
  sessionSeed: '',
  newBest: false,
  profileId: '',
};

/** Build a fresh board for a round. */
function setupRound(mode: GameMode, stories: Story[], roundIndex: number, sessionSeed: string) {
  const story = stories[roundIndex];
  // Fail loudly rather than dealing an undefined board. In v2 this surfaced as
  // "nothing happens when I press Play" on a level whose pool was still empty.
  if (!story) {
    throw new Error(`setupRound: no story at round ${roundIndex} of ${stories.length}`);
  }
  const progress = roundProgress(roundIndex, stories.length);
  const grid = mode.gridFor(progress);
  return {
    roundIndex,
    grid,
    tiles: shuffle(grid, boardSeed(story.id, sessionSeed, grid)),
    secondsLimit: mode.secondsFor(progress, grid),
    secondsUsed: 0,
    peeksUsed: 0,
    peeking: false,
    storyCardPaused: false,
  };
}

export const useGame = create<GameState>((set, get) => ({
  ...initial,

  startGame: (modeId, length, profileId) => {
    const mode = MODES[modeId] ?? MODES[DEFAULT_MODE];
    const sessionSeed = makeSessionSeed();
    const stories = pickStories(effectivePool(mode.pool), length ?? DEFAULT_LENGTH, sessionSeed);

    setLastMode(mode.id);
    setLastLength(stories.length);

    set({
      ...initial,
      mode,
      stories,
      sessionSeed,
      profileId,
      results: [],
      phase: 'briefing',
      ...setupRound(mode, stories, 0, sessionSeed),
    });
  },

  beginRound: () => {
    if (get().phase === 'briefing') set({ phase: 'playing' });
  },

  swapTiles: (a, b) => {
    const s = get();
    if (s.phase !== 'playing') return;

    const tiles = swap(s.tiles, a, b);

    if (isSolved(tiles)) {
      set({ tiles, phase: 'solved', peeking: false });
      setTimeout(() => {
        if (get().phase === 'solved') get().finishRound(true);
      }, SOLVE_CELEBRATION_MS);
    } else {
      set({ tiles });
    }
  },

  tick: (secondsElapsed) => {
    const s = get();
    if (s.phase !== 'playing') return;

    const secondsUsed = Math.min(secondsElapsed, s.secondsLimit);
    set({ secondsUsed });

    if (secondsUsed >= s.secondsLimit) {
      set({ phase: 'timedOut' });
      get().finishRound(false);
    }
  },

  peek: () => {
    const s = get();
    if (s.phase !== 'playing' || !s.mode.peekEnabled || s.peeking) return;
    set({ peeking: true, peeksUsed: s.peeksUsed + 1 });
  },

  endPeek: () => set({ peeking: false }),

  toggleStoryCardPause: () => set((s) => ({ storyCardPaused: !s.storyCardPaused })),

  finishRound: (solved) => {
    const s = get();
    if (s.phase !== 'solved' && s.phase !== 'timedOut') return;

    const story = s.stories[s.roundIndex];
    const result = scoreRound({
      storyId: story.id,
      roundIndex: s.roundIndex,
      grid: s.grid,
      solved,
      correctTiles: correctCount(s.tiles),
      totalTiles: s.grid * s.grid,
      secondsUsed: s.secondsUsed,
      secondsLimit: s.secondsLimit,
      peeksUsed: s.peeksUsed,
      peekPenalty: s.mode.peekPenalty,
    });

    set({
      results: [...s.results, result],
      phase: 'storyCard',
      peeking: false,
      storyCardPaused: false,
    });
  },

  advance: () => {
    const s = get();
    if (s.phase !== 'storyCard') return;

    const next = s.roundIndex + 1;

    if (next >= s.stories.length) {
      const score = totalScore(s.results);
      const stars = goldStarCount(s.results);
      set({
        phase: 'results',
        newBest: recordRun(s.profileId, s.mode.id, s.stories.length, score, stars),
      });
      return;
    }

    set({ phase: 'briefing', ...setupRound(s.mode, s.stories, next, s.sessionSeed) });
  },

  quit: () => set({ ...initial }),
}));

// ---- selectors -------------------------------------------------------------

export function currentStory(s: GameState): Story | undefined {
  return s.stories[Math.min(s.roundIndex, s.stories.length - 1)];
}

export function totalRounds(s: GameState): number {
  return s.stories.length;
}

export function runningScore(s: GameState): number {
  return totalScore(s.results);
}

export function lastResult(s: GameState): RoundResult | undefined {
  return s.results[s.results.length - 1];
}
