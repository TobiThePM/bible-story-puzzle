export type GridSize = 3 | 4 | 5;

export interface Story {
  /** Stable slug. Never reused, never renamed once shipped. */
  id: string;
  /** 1-20, canonical biblical order. */
  order: number;
  title: string;
  /** e.g. "Joshua 6:12-20" */
  reference: string;
  /** 1-2 sentences, reading age ~9, <= 220 chars. */
  retelling: string;
  /** Short quoted verse, <= 160 chars. */
  verse: string;
  verseReference: string;
  /** Path under /public. One whole image - never pre-cut into tiles. */
  image: string;
  /** Small version for results/library lists. */
  thumb: string;
  /** Screen-reader description of the illustration. */
  alt: string;
}

export type ModeId = 'little-ones' | 'standard' | 'champion' | 'master';

/** How many puzzles in one sitting. */
export type SessionLength = 5 | 10 | 20;

export interface GameMode {
  id: ModeId;
  label: string;
  tagline: string;
  description: string;
  /**
   * Grid size at a point in the session.
   *
   * `progress` is 0 on the first round and 1 on the last, whatever the session
   * length. Ramping on progress rather than on the absolute round number means
   * a 5-puzzle game still climbs from easy to hard instead of staying on the
   * opening difficulty the whole way.
   */
  gridFor: (progress: number) => GridSize;
  /** Seconds allowed at a point in the session, for the grid in play. */
  secondsFor: (progress: number, grid: GridSize) => number;
  peekEnabled: boolean;
  peekPenalty: number;
  peekSeconds: number;
  storyCardSeconds: number;
}

/** 0 on the first round, 1 on the last, for any session length. */
export function roundProgress(roundIndex: number, totalRounds: number): number {
  return totalRounds <= 1 ? 0 : roundIndex / (totalRounds - 1);
}

export interface RoundResult {
  storyId: string;
  roundIndex: number;
  grid: GridSize;
  solved: boolean;
  correctTiles: number;
  totalTiles: number;
  secondsUsed: number;
  secondsLimit: number;
  peeksUsed: number;
  goldStar: boolean;
  score: number;
}

export type Phase =
  | 'idle'
  | 'briefing'
  | 'playing'
  | 'solved'
  | 'timedOut'
  | 'storyCard'
  | 'results';
