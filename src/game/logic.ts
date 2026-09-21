import type { GridSize } from '@/types';
import { rngFrom } from './rng';

/**
 * Board representation.
 *
 * `tiles[screenPosition] = homePiece`
 *
 * The board is solved when every piece sits in its own slot, i.e.
 * tiles[i] === i for all i. That is a pure array check - the game NEVER
 * compares pixels. The picture looking correct is a consequence of the
 * array being correct, not something we measure.
 */

export function solvedBoard(grid: GridSize): number[] {
  return Array.from({ length: grid * grid }, (_, i) => i);
}

export function isSolved(tiles: number[]): boolean {
  return tiles.every((home, pos) => home === pos);
}

export function correctCount(tiles: number[]): number {
  return tiles.reduce((n, home, pos) => (home === pos ? n + 1 : n), 0);
}

export function swap(tiles: number[], a: number, b: number): number[] {
  if (a === b) return tiles;
  const next = tiles.slice();
  next[a] = tiles[b];
  next[b] = tiles[a];
  return next;
}

/** Row/column of a piece within the source image. */
export function pieceRowCol(piece: number, grid: GridSize): { row: number; col: number } {
  return { row: Math.floor(piece / grid), col: piece % grid };
}

/**
 * Minimum fraction of tiles that must start away from home, so a shuffle is
 * never accidentally almost-solved.
 */
export const MIN_DISPLACEMENT = 0.8;

/**
 * Produce a scrambled board from a seed.
 *
 * Any permutation of a swap puzzle is solvable (unlike a sliding puzzle,
 * which has a parity constraint), so there is no solvability check to do.
 * The real risk is a shuffle that is too easy, so we reshuffle until at
 * least MIN_DISPLACEMENT of tiles are out of place.
 */
export function shuffle(grid: GridSize, seed: string): number[] {
  const total = grid * grid;
  const rand = rngFrom(seed);
  const required = Math.ceil(total * MIN_DISPLACEMENT);

  for (let attempt = 0; attempt < 100; attempt++) {
    const tiles = solvedBoard(grid);

    // Fisher-Yates
    for (let i = total - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = tiles[i];
      tiles[i] = tiles[j];
      tiles[j] = tmp;
    }

    const displaced = total - correctCount(tiles);
    if (displaced >= required) return tiles;
  }

  // Fallback that cannot loop forever: a full rotation leaves every tile
  // displaced by construction.
  const tiles = solvedBoard(grid);
  return tiles.map((_, i) => (i + 1) % total);
}

/** Deterministic per-round seed. Same story + same session = same board. */
export function boardSeed(storyId: string, sessionSeed: string, grid: GridSize): string {
  return `${storyId}:${grid}:${sessionSeed}`;
}
