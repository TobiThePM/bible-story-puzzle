import type { ModeId } from '@/types';

/**
 * localStorage only. Nothing leaves the device, ever.
 * No accounts, no names, no emails, no analytics. This is a children's product.
 */
const PREFIX = 'bsp.v1.';

interface BestRecord {
  score: number;
  goldStars: number;
  at: string;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* private browsing, quota, disabled storage - the game still works */
  }
}

/**
 * Best scores are kept per mode AND per session length: a twenty-round total
 * would otherwise permanently beat every five-round game, so short games could
 * never show a personal best.
 */
export function getBest(mode: ModeId, rounds: number): BestRecord | null {
  return read<BestRecord | null>(`best.${mode}.${rounds}`, null);
}

export function recordRun(
  mode: ModeId,
  rounds: number,
  score: number,
  goldStars: number
): boolean {
  const current = getBest(mode, rounds);
  const isBest = !current || score > current.score;
  if (isBest) {
    write(`best.${mode}.${rounds}`, { score, goldStars, at: new Date().toISOString() });
  }
  return isBest;
}

export function getLastLength(): number | null {
  return read<number | null>('lastLength', null);
}

export function setLastLength(rounds: number): void {
  write('lastLength', rounds);
}

export function getLastMode(): ModeId | null {
  return read<ModeId | null>('lastMode', null);
}

export function setLastMode(mode: ModeId): void {
  write('lastMode', mode);
}
