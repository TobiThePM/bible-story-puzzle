import type { GridSize, RoundResult } from '@/types';

export interface RoundScoreInput {
  storyId: string;
  roundIndex: number;
  grid: GridSize;
  solved: boolean;
  correctTiles: number;
  totalTiles: number;
  secondsUsed: number;
  secondsLimit: number;
  peeksUsed: number;
  peekPenalty: number;
}

export const COMPLETION_POINTS = 100;
export const PARTIAL_POINTS_MAX = 60;
export const TIME_BONUS_PER_SECOND = 5;
export const GOLD_STAR_BONUS = 50;

/**
 * Pure, deterministic. Same input, same output, no clock, no randomness.
 * Phase 2 multiplayer can run this identical function on a server.
 */
export function scoreRound(input: RoundScoreInput): RoundResult {
  const secondsRemaining = Math.max(0, input.secondsLimit - input.secondsUsed);

  const completion = input.solved ? COMPLETION_POINTS : 0;

  const partial = input.solved
    ? 0
    : Math.round((PARTIAL_POINTS_MAX * input.correctTiles) / input.totalTiles);

  const timeBonus = input.solved ? Math.floor(secondsRemaining) * TIME_BONUS_PER_SECOND : 0;

  const penalty = input.peeksUsed * input.peekPenalty;

  const goldStar =
    input.solved && input.peeksUsed === 0 && input.secondsUsed <= input.secondsLimit / 2;

  const score = Math.max(0, completion + partial + timeBonus - penalty + (goldStar ? GOLD_STAR_BONUS : 0));

  return {
    storyId: input.storyId,
    roundIndex: input.roundIndex,
    grid: input.grid,
    solved: input.solved,
    correctTiles: input.correctTiles,
    totalTiles: input.totalTiles,
    secondsUsed: input.secondsUsed,
    secondsLimit: input.secondsLimit,
    peeksUsed: input.peeksUsed,
    goldStar,
    score,
  };
}

export function totalScore(results: RoundResult[]): number {
  return results.reduce((sum, r) => sum + r.score, 0);
}

export function goldStarCount(results: RoundResult[]): number {
  return results.reduce((n, r) => (r.goldStar ? n + 1 : n), 0);
}

export interface Rank {
  name: string;
  min: number;
  blurb: string;
}

/** Tuned to Standard mode, where a perfect run is roughly 7,400. */
export const RANKS: Rank[] = [
  { name: 'Faithful Witness', min: 7000, blurb: 'You know these stories by heart.' },
  { name: 'Champion', min: 6000, blurb: 'Fast hands and a sharp eye.' },
  { name: 'Watchman', min: 4500, blurb: 'Steady, and paying attention.' },
  { name: 'Scribe', min: 3000, blurb: 'Learning the stories well.' },
  { name: 'Student', min: 1500, blurb: 'A good start. Go again.' },
  { name: 'Seeker', min: 0, blurb: 'Every journey starts somewhere.' },
];

export function rankFor(score: number): Rank {
  return RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];
}
