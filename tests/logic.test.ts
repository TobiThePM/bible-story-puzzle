import { describe, it, expect } from 'vitest';
import {
  shuffle,
  isSolved,
  correctCount,
  swap,
  solvedBoard,
  pieceRowCol,
  MIN_DISPLACEMENT,
} from '@/game/logic';
import { rngFrom } from '@/game/rng';
import type { GridSize } from '@/types';

const GRIDS: GridSize[] = [3, 4, 5];

describe('solvedBoard / isSolved / correctCount', () => {
  it('a fresh board is solved', () => {
    for (const g of GRIDS) {
      expect(isSolved(solvedBoard(g))).toBe(true);
      expect(correctCount(solvedBoard(g))).toBe(g * g);
    }
  });

  it('counts partially correct boards', () => {
    const tiles = [0, 1, 3, 2]; // first two home, last two swapped
    expect(isSolved(tiles)).toBe(false);
    expect(correctCount(tiles)).toBe(2);
  });
});

describe('swap', () => {
  it('exchanges two positions without mutating the original', () => {
    const before = [0, 1, 2, 3];
    const after = swap(before, 0, 3);
    expect(after).toEqual([3, 1, 2, 0]);
    expect(before).toEqual([0, 1, 2, 3]);
  });

  it('swapping a tile with itself is a no-op', () => {
    const before = [0, 1, 2, 3];
    expect(swap(before, 2, 2)).toBe(before);
  });

  it('two swaps of the same pair restores the board', () => {
    const start = shuffle(4, 'restore-test');
    expect(swap(swap(start, 1, 9), 1, 9)).toEqual(start);
  });
});

describe('shuffle', () => {
  it('always contains every piece exactly once', () => {
    for (const g of GRIDS) {
      for (let i = 0; i < 200; i++) {
        const tiles = shuffle(g, `seed-${g}-${i}`);
        expect(tiles).toHaveLength(g * g);
        expect([...tiles].sort((a, b) => a - b)).toEqual(solvedBoard(g));
      }
    }
  });

  it('is never dealt already solved', () => {
    for (const g of GRIDS) {
      for (let i = 0; i < 500; i++) {
        expect(isSolved(shuffle(g, `unsolved-${g}-${i}`))).toBe(false);
      }
    }
  });

  // The headline guarantee from the spec: a board is never accidentally easy.
  it('displaces at least 80% of tiles across 1000 seeded runs', () => {
    for (const g of GRIDS) {
      const total = g * g;
      const required = Math.ceil(total * MIN_DISPLACEMENT);
      for (let i = 0; i < 1000; i++) {
        const tiles = shuffle(g, `displacement-${g}-${i}`);
        expect(total - correctCount(tiles)).toBeGreaterThanOrEqual(required);
      }
    }
  });

  it('is deterministic: the same seed gives the same board', () => {
    expect(shuffle(4, 'jericho:4:abc')).toEqual(shuffle(4, 'jericho:4:abc'));
  });

  it('different seeds give different boards', () => {
    expect(shuffle(4, 'seed-a')).not.toEqual(shuffle(4, 'seed-b'));
  });
});

describe('pieceRowCol', () => {
  it('maps piece index to row and column', () => {
    expect(pieceRowCol(0, 4)).toEqual({ row: 0, col: 0 });
    expect(pieceRowCol(5, 4)).toEqual({ row: 1, col: 1 });
    expect(pieceRowCol(15, 4)).toEqual({ row: 3, col: 3 });
  });
});

describe('rng', () => {
  it('is reproducible and stays within [0, 1)', () => {
    const a = rngFrom('same');
    const b = rngFrom('same');
    for (let i = 0; i < 100; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
