import { describe, it, expect } from 'vitest';
import { pickStories } from '@/game/selection';
import { STORIES } from '@/content/stories';
import { LENGTHS, MODES, MODE_ORDER } from '@/content/modes';
import { roundProgress } from '@/types';

describe('pickStories', () => {
  it('returns exactly the requested number of stories', () => {
    for (const { rounds } of LENGTHS) {
      expect(pickStories(rounds, 'seed-a')).toHaveLength(rounds);
    }
  });

  it('never repeats a story within one session', () => {
    for (const { rounds } of LENGTHS) {
      for (let i = 0; i < 200; i++) {
        const picked = pickStories(rounds, `dupe-${rounds}-${i}`);
        expect(new Set(picked.map((s) => s.id)).size).toBe(rounds);
      }
    }
  });

  // The teaching idea: a run always travels forwards through the Bible.
  it('always returns stories in canonical order', () => {
    for (const { rounds } of LENGTHS) {
      for (let i = 0; i < 200; i++) {
        const orders = pickStories(rounds, `order-${rounds}-${i}`).map((s) => s.order);
        expect([...orders].sort((a, b) => a - b)).toEqual(orders);
      }
    }
  });

  it('a full-length game is every story, in order', () => {
    const picked = pickStories(20, 'anything');
    expect(picked.map((s) => s.id)).toEqual(STORIES.map((s) => s.id));
  });

  it('is deterministic for a given seed', () => {
    expect(pickStories(5, 'same').map((s) => s.id)).toEqual(
      pickStories(5, 'same').map((s) => s.id)
    );
  });

  // Replayability: short games must not be the same five stories every time.
  it('varies the selection across seeds', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      seen.add(pickStories(5, `vary-${i}`).map((s) => s.id).join(','));
    }
    expect(seen.size).toBeGreaterThan(50);
  });

  // Over many sessions no story should be effectively unreachable.
  it('can reach every story in a short game', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) {
      for (const s of pickStories(5, `reach-${i}`)) seen.add(s.id);
    }
    expect(seen.size).toBe(STORIES.length);
  });

  it('handles degenerate lengths safely', () => {
    expect(pickStories(0, 'x')).toEqual([]);
    expect(pickStories(-3, 'x')).toEqual([]);
    expect(pickStories(999, 'x')).toHaveLength(STORIES.length);
  });
});

describe('difficulty ramps regardless of session length', () => {
  it('gives the first and last round of a 5-game the same grids as a 20-game', () => {
    for (const id of MODE_ORDER) {
      const mode = MODES[id];
      const firstShort = mode.gridFor(roundProgress(0, 5));
      const firstLong = mode.gridFor(roundProgress(0, 20));
      const lastShort = mode.gridFor(roundProgress(4, 5));
      const lastLong = mode.gridFor(roundProgress(19, 20));

      expect(firstShort, `${id} first`).toBe(firstLong);
      expect(lastShort, `${id} last`).toBe(lastLong);
    }
  });

  // The bug this guards: ramping on absolute round number meant a 5-round
  // Standard game never left 3x3, because the switch happened at round 6.
  it('a short Standard game still reaches 4x4', () => {
    const grids = [0, 1, 2, 3, 4].map((i) => MODES.standard.gridFor(roundProgress(i, 5)));
    expect(grids).toContain(3);
    expect(grids).toContain(4);
  });

  it('a short Master game still reaches 5x5', () => {
    const grids = [0, 1, 2, 3, 4].map((i) => MODES.master.gridFor(roundProgress(i, 5)));
    expect(grids).toContain(5);
  });

  it('never gets easier as a session goes on, at any length', () => {
    for (const id of MODE_ORDER) {
      for (const { rounds } of LENGTHS) {
        for (let i = 1; i < rounds; i++) {
          expect(
            MODES[id].gridFor(roundProgress(i, rounds)),
            `${id} @ ${rounds} round ${i}`
          ).toBeGreaterThanOrEqual(MODES[id].gridFor(roundProgress(i - 1, rounds)));
        }
      }
    }
  });

  it('gives every round a legal grid and a positive clock, at any length', () => {
    for (const id of MODE_ORDER) {
      for (const { rounds } of LENGTHS) {
        for (let i = 0; i < rounds; i++) {
          const p = roundProgress(i, rounds);
          const grid = MODES[id].gridFor(p);
          expect([3, 4, 5], `${id} @ ${rounds}`).toContain(grid);
          expect(MODES[id].secondsFor(p, grid), `${id} @ ${rounds}`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('roundProgress', () => {
  it('runs 0 to 1 across a session', () => {
    expect(roundProgress(0, 20)).toBe(0);
    expect(roundProgress(19, 20)).toBe(1);
    expect(roundProgress(0, 5)).toBe(0);
    expect(roundProgress(4, 5)).toBe(1);
  });

  it('does not divide by zero on a one-round session', () => {
    expect(roundProgress(0, 1)).toBe(0);
    expect(roundProgress(0, 0)).toBe(0);
  });
});
