import type { Story, StoryPool } from '@/types';
import { STORIES } from '@/content/stories';
import { rngFrom } from './rng';

/**
 * Choose which stories a session plays.
 *
 * Each level draws from its OWN pool of twenty, so the three levels never serve
 * the same picture. Every pool travels the whole arc from Genesis to the
 * Resurrection, so a player reaches the Cross whatever difficulty they pick -
 * the teaching is complete at every level, not only the hardest.
 *
 * Within a pool, two things pull against each other:
 *
 *   1. REPLAYABILITY. A short game that always serves the first five stories
 *      is the same game every time.
 *   2. THE BIBLE'S ORDER. Travelling forwards through scripture is the whole
 *      teaching idea.
 *
 * So: pick at random, then sort the picks back into biblical order. A short
 * game is a different set each time but still moves forwards.
 *
 * Selection is seeded, so a session is reproducible - and so Phase 2
 * multiplayer can deal every player in a room the identical set.
 */
export function storiesInPool(pool: StoryPool): Story[] {
  return STORIES.filter((s) => s.pool === pool).sort((a, b) => a.order - b.order);
}

/**
 * TRANSITIONAL - remove once pools two and three are filled.
 *
 * Pools two and three are waiting on their forty illustrations. Until those
 * exist, those levels fall back to pool one so they stay playable with the new
 * v2 timings rather than dealing an empty board. Without this, choosing
 * Rising Tide crashed with "Cannot read properties of undefined".
 *
 * `poolsReady()` reports when the fallback is no longer doing anything, and a
 * test asserts the fallback disappears on its own once the art lands.
 */
export function effectivePool(pool: StoryPool): StoryPool {
  return storiesInPool(pool).length > 0 ? pool : 'one';
}

export function poolsReady(): boolean {
  return (['one', 'two', 'three'] as StoryPool[]).every((p) => storiesInPool(p).length > 0);
}

export function pickStories(pool: StoryPool, length: number, seed: string): Story[] {
  const all = storiesInPool(pool);

  if (length >= all.length) return all;
  if (length <= 0) return [];

  const rand = rngFrom(`selection:${pool}:${seed}`);
  const candidates = [...all];

  // Partial Fisher-Yates: only shuffle as far as we need.
  for (let i = 0; i < length; i++) {
    const j = i + Math.floor(rand() * (candidates.length - i));
    const tmp = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = tmp;
  }

  return candidates.slice(0, length).sort((a, b) => a.order - b.order);
}
