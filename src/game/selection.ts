import type { Story } from '@/types';
import { STORIES } from '@/content/stories';
import { rngFrom } from './rng';

/**
 * Choose which stories a session plays.
 *
 * Two things matter and they pull against each other:
 *
 *   1. REPLAYABILITY. A short game that always serves Creation, Noah, Babel,
 *      Abraham, Joseph is the same game every time. Short games only work if
 *      the selection varies.
 *
 *   2. THE BIBLE'S ORDER. Playing through the stories in canonical order is
 *      the whole teaching idea - a run is a walk down the Bible's spine.
 *
 * So: pick at random, then sort the picks back into canonical order. A short
 * game is a different five stories each time, but still travels forwards
 * through the Bible rather than jumping about.
 *
 * Selection is seeded, so a session is reproducible - and so Phase 2
 * multiplayer can deal every player in a room the identical set.
 */
export function pickStories(length: number, seed: string): Story[] {
  const all = STORIES;

  if (length >= all.length) return [...all];
  if (length <= 0) return [];

  const rand = rngFrom(`selection:${seed}`);
  const pool = [...all];

  // Partial Fisher-Yates: only shuffle as far as we need.
  for (let i = 0; i < length; i++) {
    const j = i + Math.floor(rand() * (pool.length - i));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  return pool.slice(0, length).sort((a, b) => a.order - b.order);
}
