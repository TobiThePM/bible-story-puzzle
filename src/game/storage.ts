import type { ModeId } from '@/types';

/**
 * LOCAL PROFILES. localStorage only. Nothing leaves the device, ever.
 *
 * Players type a name so they can see their own best scores, and several
 * profiles can share one tablet - a family, or a Sunday school class passing a
 * device around. There is no server, no sign-up, no email and no password.
 * Nothing is transmitted anywhere, which is what keeps this safe to hand to
 * children without a privacy policy or parental consent machinery.
 *
 * Scores are keyed by profile AND level AND session length, so a 20-round
 * total cannot permanently outrank every 5-round game.
 */
const PREFIX = 'bsp.v2.';

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
}

export interface BestRecord {
  score: number;
  goldStars: number;
  at: string;
}

export const MAX_NAME_LENGTH = 16;
export const MAX_PROFILES = 8;

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

// ---- names ----------------------------------------------------------------

/** Trim, collapse whitespace, cap length. Returns '' if nothing usable. */
export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH);
}

// ---- profiles -------------------------------------------------------------

export function getProfiles(): Profile[] {
  return read<Profile[]>('profiles', []);
}

export function getActiveProfile(): Profile | null {
  const id = read<string | null>('activeProfileId', null);
  if (!id) return null;
  return getProfiles().find((p) => p.id === id) ?? null;
}

export function setActiveProfile(id: string): void {
  write('activeProfileId', id);
}

/**
 * Create a profile, or return the existing one if that name is already taken
 * on this device - re-typing your name should get you back to your scores,
 * not start you over.
 */
export function createProfile(rawName: string): Profile | null {
  const name = cleanName(rawName);
  if (!name) return null;

  const profiles = getProfiles();
  const existing = profiles.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    setActiveProfile(existing.id);
    return existing;
  }

  if (profiles.length >= MAX_PROFILES) return null;

  const profile: Profile = {
    id: `p_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`,
    name,
    createdAt: new Date().toISOString(),
  };

  write('profiles', [...profiles, profile]);
  setActiveProfile(profile.id);
  return profile;
}

export function deleteProfile(id: string): void {
  write(
    'profiles',
    getProfiles().filter((p) => p.id !== id)
  );
  const scores = read<Record<string, unknown>>('scores', {});
  delete scores[id];
  write('scores', scores);
  if (read<string | null>('activeProfileId', null) === id) write('activeProfileId', null);
}

// ---- scores ---------------------------------------------------------------

type ScoreBook = Record<string, Record<string, BestRecord>>;

const slot = (mode: ModeId, rounds: number) => `${mode}.${rounds}`;

export function getBest(profileId: string, mode: ModeId, rounds: number): BestRecord | null {
  const book = read<ScoreBook>('scores', {});
  return book[profileId]?.[slot(mode, rounds)] ?? null;
}

/** All of one profile's bests, keyed `mode.rounds`. */
export function getAllBests(profileId: string): Record<string, BestRecord> {
  return read<ScoreBook>('scores', {})[profileId] ?? {};
}

/** Returns true if this run beat the profile's previous best for that slot. */
export function recordRun(
  profileId: string,
  mode: ModeId,
  rounds: number,
  score: number,
  goldStars: number
): boolean {
  if (!profileId) return false;

  const book = read<ScoreBook>('scores', {});
  const forProfile = book[profileId] ?? {};
  const key = slot(mode, rounds);
  const current = forProfile[key];
  const isBest = !current || score > current.score;

  if (isBest) {
    forProfile[key] = { score, goldStars, at: new Date().toISOString() };
    book[profileId] = forProfile;
    write('scores', book);
  }

  return isBest;
}

/** Total gold stars a profile has earned across every run. */
export function lifetimeGoldStars(profileId: string): number {
  return Object.values(getAllBests(profileId)).reduce((n, r) => n + r.goldStars, 0);
}

// ---- last-used settings ---------------------------------------------------

export function getLastMode(): ModeId | null {
  return read<ModeId | null>('lastMode', null);
}

export function setLastMode(mode: ModeId): void {
  write('lastMode', mode);
}

export function getLastLength(): number | null {
  return read<number | null>('lastLength', null);
}

export function setLastLength(rounds: number): void {
  write('lastLength', rounds);
}
