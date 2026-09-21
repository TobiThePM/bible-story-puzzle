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

export interface GameMode {
  id: ModeId;
  label: string;
  tagline: string;
  description: string;
  /** Grid size for a given round index (0-19). */
  gridFor: (roundIndex: number) => GridSize;
  /** Seconds allowed for a given round index and grid size. */
  secondsFor: (roundIndex: number, grid: GridSize) => number;
  peekEnabled: boolean;
  peekPenalty: number;
  peekSeconds: number;
  storyCardSeconds: number;
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
