import { describe, it, expect } from 'vitest';
import { pickStories, storiesInPool, effectivePool, poolsReady } from '@/game/selection';
import { STORIES } from '@/content/stories';
import { LENGTHS, MODES, MODE_ORDER } from '@/content/modes';
import { roundProgress } from '@/types';

describe('pickStories', () => {
  it('returns exactly the requested number of stories', () => {
    for (const { rounds } of LENGTHS) {
      expect(pickStories('one', rounds, 'seed-a')).toHaveLength(rounds);
    }
  });

  it('never repeats a story within one session', () => {
    for (const { rounds } of LENGTHS) {
      for (let i = 0; i < 200; i++) {
        const picked = pickStories('one', rounds, `dupe-${rounds}-${i}`);
        expect(new Set(picked.map((s) => s.id)).size).toBe(rounds);
      }
    }
  });

  // The teaching idea: a run always travels forwards through the Bible.
  it('always returns stories in canonical order', () => {
    for (const { rounds } of LENGTHS) {
      for (let i = 0; i < 200; i++) {
        const orders = pickStories('one', rounds, `order-${rounds}-${i}`).map((s) => s.order);
        expect([...orders].sort((a, b) => a - b)).toEqual(orders);
      }
    }
  });

  it('a full-length game is every story, in order', () => {
    const picked = pickStories('one', 20, 'anything');
    expect(picked.map((s) => s.id)).toEqual(storiesInPool('one').map((s) => s.id));
  });

  it('is deterministic for a given seed', () => {
    expect(pickStories('one', 5, 'same').map((s) => s.id)).toEqual(
      pickStories('one', 5, 'same').map((s) => s.id)
    );
  });

  // Replayability: short games must not be the same five stories every time.
  it('varies the selection across seeds', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      seen.add(pickStories('one', 5, `vary-${i}`).map((s) => s.id).join(','));
    }
    expect(seen.size).toBeGreaterThan(50);
  });

  // Over many sessions no story should be effectively unreachable.
  it('can reach every story in a short game', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) {
      for (const s of pickStories('one', 5, `reach-${i}`)) seen.add(s.id);
    }
    expect(seen.size).toBe(storiesInPool('one').length);
  });

  it('handles degenerate lengths safely', () => {
    expect(pickStories('one', 0, 'x')).toEqual([]);
    expect(pickStories('one', -3, 'x')).toEqual([]);
    expect(pickStories('one', 999, 'x')).toHaveLength(storiesInPool('one').length);
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
  it('a short Rising Tide game still reaches 4x4', () => {
    const grids = [0, 1, 2, 3, 4].map((i) => MODES['rising-tide'].gridFor(roundProgress(i, 5)));
    expect(grids).toContain(3);
    expect(grids).toContain(4);
  });

  it('keeps Refiners Fire at 4x4 throughout', () => {
    const grids = [0, 1, 2, 3, 4].map((i) => MODES['refiners-fire'].gridFor(roundProgress(i, 5)));
    expect(new Set(grids)).toEqual(new Set([4]));
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

describe('v2 playability guarantees', () => {
  // These exist because v1 shipped clocks that adult testers could not beat.
  // Each one encodes a specific thing that went wrong.

  it('gives every level a free look at the picture before the clock starts', () => {
    for (const id of MODE_ORDER) {
      expect(MODES[id].previewSeconds, id).toBeGreaterThan(0);
    }
  });

  it('leaves Peek available on every level', () => {
    // v1 disabled Peek on the two hardest levels - removing the safety net
    // exactly where testers needed it most.
    for (const id of MODE_ORDER) {
      expect(MODES[id].peekEnabled, id).toBe(true);
    }
  });

  it('gives bigger grids MORE time, never less', () => {
    for (const id of MODE_ORDER) {
      const mode = MODES[id];
      const samples = [0, 0.25, 0.5, 0.75, 1].map((p) => ({
        grid: mode.gridFor(p),
        seconds: mode.secondsFor(p, mode.gridFor(p)),
      }));
      for (const a of samples) {
        for (const b of samples) {
          if (a.grid < b.grid) {
            expect(b.seconds, `${id}: ${b.grid}x${b.grid} vs ${a.grid}x${a.grid}`).toBeGreaterThan(
              a.seconds
            );
          }
        }
      }
    }
  });

  it('allows at least 3.5 seconds per tile on every round of every level', () => {
    // A tester needs time to parse the picture AND move every piece. Below
    // roughly this floor the round stops being solvable and starts being luck.
    for (const id of MODE_ORDER) {
      for (const { rounds } of LENGTHS) {
        for (let i = 0; i < rounds; i++) {
          const p = roundProgress(i, rounds);
          const grid = MODES[id].gridFor(p);
          const perTile = MODES[id].secondsFor(p, grid) / (grid * grid);
          expect(perTile, `${id} @ ${rounds}, round ${i} (${grid}x${grid})`).toBeGreaterThanOrEqual(
            3.5
          );
        }
      }
    }
  });

  it('is more generous at every grid size than v1 was', () => {
    const v1 = { 3: 45, 4: 60 } as Record<number, number>;
    for (const id of MODE_ORDER) {
      for (const p of [0, 0.5, 1]) {
        const grid = MODES[id].gridFor(p);
        expect(MODES[id].secondsFor(p, grid), `${id} ${grid}x${grid}`).toBeGreaterThanOrEqual(
          v1[grid]
        );
      }
    }
  });
});

describe('story pools', () => {
  it('gives every level its own pool', () => {
    const pools = MODE_ORDER.map((id) => MODES[id].pool);
    expect(new Set(pools).size).toBe(MODE_ORDER.length);
  });

  it('never serves the same story on two different levels', () => {
    const seen = new Set<string>();
    for (const id of MODE_ORDER) {
      for (const story of storiesInPool(MODES[id].pool)) {
        expect(seen.has(story.id), `${story.id} appears in more than one pool`).toBe(false);
        seen.add(story.id);
      }
    }
  });
});

describe('transitional pool fallback', () => {
  // Pools two and three are waiting on their forty illustrations. Until then
  // those levels borrow pool one rather than dealing an empty board.
  it('never returns an empty set for any level', () => {
    for (const id of MODE_ORDER) {
      for (const { rounds } of LENGTHS) {
        const picked = pickStories(effectivePool(MODES[id].pool), rounds, `fallback-${id}`);
        expect(picked.length, `${id} @ ${rounds}`).toBeGreaterThan(0);
      }
    }
  });

  it('stops falling back on its own once every pool has stories', () => {
    for (const p of ['one', 'two', 'three'] as const) {
      const expected = storiesInPool(p).length > 0 ? p : 'one';
      expect(effectivePool(p)).toBe(expected);
    }
    // When this flips true, delete effectivePool and this block.
    expect(typeof poolsReady()).toBe('boolean');
  });
});

describe('the ready gate', () => {
  // Story text is written long before its illustration exists. `ready` is what
  // keeps main shippable mid-art-run: the game serves only illustrated
  // stories, and a content test proves their files are really on disk.
  it('never serves a story that has no illustration yet', () => {
    for (const pool of ['one', 'two', 'three'] as const) {
      for (const story of storiesInPool(pool)) {
        expect(story.ready, `${story.id} was served without artwork`).toBe(true);
      }
    }
  });

  it('never deals an unready story into a session', () => {
    for (const id of MODE_ORDER) {
      for (const { rounds } of LENGTHS) {
        const picked = pickStories(effectivePool(MODES[id].pool), rounds, `ready-${id}`);
        for (const story of picked) expect(story.ready, story.id).toBe(true);
      }
    }
  });
});
