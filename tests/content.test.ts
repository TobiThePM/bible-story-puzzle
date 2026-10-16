import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { STORIES, TOTAL_ROUNDS } from '@/content/stories';
import { MODES, MODE_ORDER, LENGTHS, DEFAULT_LENGTH } from '@/content/modes';
import { storiesInPool } from '@/game/selection';
import type { StoryPool } from '@/types';

const PUBLIC_DIR = path.resolve(__dirname, '../public');

/**
 * These guard the content contract. A broken stories.ts fails the build
 * instead of shipping a game with a missing picture.
 */
describe('stories content contract', () => {
  it('has exactly 20 stories', () => {
    expect(STORIES).toHaveLength(20);
    expect(TOTAL_ROUNDS).toBe(20);
  });

  it('has unique ids', () => {
    const ids = STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers orders 1..20 with no gaps or duplicates', () => {
    const orders = STORIES.map((s) => s.order).sort((a, b) => a - b);
    expect(orders).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it('is declared in canonical order', () => {
    STORIES.forEach((s, i) => expect(s.order).toBe(i + 1));
  });

  it('has every required text field filled in', () => {
    for (const s of STORIES) {
      expect(s.title.length, s.id).toBeGreaterThan(0);
      expect(s.reference.length, s.id).toBeGreaterThan(0);
      expect(s.retelling.length, s.id).toBeGreaterThan(0);
      expect(s.verse.length, s.id).toBeGreaterThan(0);
      expect(s.verseReference.length, s.id).toBeGreaterThan(0);
      expect(s.alt.length, s.id).toBeGreaterThan(0);
    }
  });

  it('keeps retellings and verses short enough for the story card', () => {
    for (const s of STORIES) {
      expect(s.retelling.length, `${s.id} retelling`).toBeLessThanOrEqual(240);
      expect(s.verse.length, `${s.id} verse`).toBeLessThanOrEqual(160);
    }
  });

  it('points at image files that actually exist', () => {
    for (const s of STORIES) {
      for (const rel of [s.image, s.thumb]) {
        const file = path.join(PUBLIC_DIR, rel);
        expect(fs.existsSync(file), `missing ${rel} for "${s.id}" - run: npm run placeholders`).toBe(
          true
        );
      }
    }
  });
});

describe('difficulty levels', () => {
  it('lists every mode in the picker', () => {
    expect(MODE_ORDER).toHaveLength(Object.keys(MODES).length);
    for (const id of MODE_ORDER) expect(MODES[id]).toBeDefined();
  });

  it('offers session lengths that all fit inside the story set', () => {
    for (const l of LENGTHS) {
      expect(l.rounds).toBeGreaterThan(0);
      expect(l.rounds).toBeLessThanOrEqual(TOTAL_ROUNDS);
    }
  });

  it('has a default length that is one of the offered options', () => {
    expect(LENGTHS.map((l) => l.rounds)).toContain(DEFAULT_LENGTH);
  });
});
