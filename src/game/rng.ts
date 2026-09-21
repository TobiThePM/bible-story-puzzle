/**
 * Seeded pseudo-random number generator (mulberry32).
 *
 * Why seeded and not Math.random():
 *   1. Tests are reproducible.
 *   2. Phase 2 multiplayer can hand every player in a room the SAME seed,
 *      so everyone races an identical board and the race is fair.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turn any string into a 32-bit integer seed (FNV-1a). */
export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function rngFrom(seedString: string): () => number {
  return mulberry32(hashSeed(seedString));
}

/** A short random seed for one play session. */
export function makeSessionSeed(): string {
  return Math.floor(Math.random() * 0xffffffff).toString(36);
}
