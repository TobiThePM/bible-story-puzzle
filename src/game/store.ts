'use client';

import { create } from 'zustand';
import type { GameMode, GridSize, ModeId, Phase, RoundResult, Story } from '@/types';
import { STORIES, TOTAL_ROUNDS } from '@/content/stories';
import { MODES, DEFAULT_MODE } from '@/content/modes';
import { boardSeed, correctCount, isSolved, shuffle, swap } from './logic';
import { scoreRound, totalScore, goldStarCount } from './scoring';
import { makeSessionSeed } from './rng';
import { recordRun, setLastMode } from './storage';

/** How long the finished picture is held before the story card appears. */
export const SOLVE_CELEBRATION_MS = 900;

export interface GameState {
  phase: Phase;
  mode: GameMode;
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

  startGame: (modeId: ModeId) => void;
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
};

/** Build a fresh board for a round. Pure apart from reading the mode config. */
function setupRound(mode: GameMode, roundIndex: number, sessionSeed: string) {
  const story = STORIES[roundIndex];
  const grid = mode.gridFor(roundIndex);
  return {
    roundIndex,
    grid,
    tiles: shuffle(grid, boardSeed(story.id, sessionSeed, grid)),
    secondsLimit: mode.secondsFor(roundIndex, grid),
    secondsUsed: 0,
    peeksUsed: 0,
    peeking: false,
    storyCardPaused: false,
  };
}

export const useGame = create<GameState>((set, get) => ({
  ...initial,

  startGame: (modeId) => {
    const mode = MODES[modeId] ?? MODES[DEFAULT_MODE];
    const sessionSeed = makeSessionSeed();
    setLastMode(mode.id);
    set({
      ...initial,
      mode,
      sessionSeed,
      results: [],
      phase: 'briefing',
      ...setupRound(mode, 0, sessionSeed),
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
      // Hold the completed picture for a beat before the story card.
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

  /** Score the round and show the story card. Shared by solve and timeout. */
  finishRound: (solved) => {
    const s = get();
    if (s.phase !== 'solved' && s.phase !== 'timedOut') return;

    const story = STORIES[s.roundIndex];
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

    if (next >= TOTAL_ROUNDS) {
      const score = totalScore(s.results);
      const stars = goldStarCount(s.results);
      set({ phase: 'results', newBest: recordRun(s.mode.id, score, stars) });
      return;
    }

    set({ phase: 'briefing', ...setupRound(s.mode, next, s.sessionSeed) });
  },

  quit: () => set({ ...initial }),
}));

// ---- selectors -------------------------------------------------------------

export function currentStory(s: GameState): Story {
  return STORIES[Math.min(s.roundIndex, TOTAL_ROUNDS - 1)];
}

export function runningScore(s: GameState): number {
  return totalScore(s.results);
}

export function lastResult(s: GameState): RoundResult | undefined {
  return s.results[s.results.length - 1];
}
