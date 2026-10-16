'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MODES,
  MODE_ORDER,
  DEFAULT_MODE,
  LENGTHS,
  DEFAULT_LENGTH,
  isSessionLength,
} from '@/content/modes';
import { useGame } from '@/game/store';
import {
  createProfile,
  getActiveProfile,
  getAllBests,
  getLastLength,
  getLastMode,
  getProfiles,
  setActiveProfile,
  cleanName,
  lifetimeGoldStars,
  MAX_NAME_LENGTH,
  type BestRecord,
  type Profile,
} from '@/game/storage';
import type { ModeId, SessionLength } from '@/types';

export default function Home() {
  const router = useRouter();
  const startGame = useGame((s) => s.startGame);

  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [switching, setSwitching] = useState(false);

  const [mode, setMode] = useState<ModeId>(DEFAULT_MODE);
  const [length, setLength] = useState<SessionLength>(DEFAULT_LENGTH);
  const [bests, setBests] = useState<Record<string, BestRecord>>({});
  const [stars, setStars] = useState(0);

  // localStorage is read after mount so the static HTML is identical for every
  // visitor (no hydration mismatch).
  useEffect(() => {
    const active = getActiveProfile();
    setProfile(active);
    setProfiles(getProfiles());
    if (active) {
      setBests(getAllBests(active.id));
      setStars(lifetimeGoldStars(active.id));
    }

    const savedMode = getLastMode();
    if (savedMode && MODES[savedMode]) setMode(savedMode);
    const savedLength = getLastLength();
    if (savedLength !== null && isSessionLength(savedLength)) setLength(savedLength);

    setReady(true);
  }, []);

  const useProfile = (p: Profile) => {
    setActiveProfile(p.id);
    setProfile(p);
    setBests(getAllBests(p.id));
    setStars(lifetimeGoldStars(p.id));
    setSwitching(false);
  };

  const submitName = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createProfile(nameInput);
    if (!created) return;
    setNameInput('');
    setProfiles(getProfiles());
    useProfile(created);
  };

  const play = () => {
    if (!profile) return;
    startGame(mode, length, profile.id);
    router.push('/play/');
  };

  const best = bests[`${mode}.${length}`];

  // ---- name gate ----------------------------------------------------------

  if (ready && (!profile || switching)) {
    return (
      <main className="page">
        <div className="shell home">
          <h1 className="home__title">Bible Story Puzzle</h1>
          <p className="home__tagline">
            Discover Scripture through some of the Bible&rsquo;s greatest stories.
          </p>

          <form className="gate" onSubmit={submitName}>
            <label className="gate__label" htmlFor="playerName">
              What should we call you?
            </label>
            <input
              id="playerName"
              className="gate__input"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              autoFocus
            />
            <button type="submit" className="btn btn--primary" disabled={!cleanName(nameInput)}>
              Start playing
            </button>
          </form>

          {profiles.length > 0 && (
            <div className="gate__existing">
              <p className="picker__heading">Or carry on as</p>
              <div className="gate__names">
                {profiles.map((p) => (
                  <button key={p.id} type="button" className="btn" onClick={() => useProfile(p)}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="home__note">
            Your name and scores are saved <strong>on this device only</strong>. No account, no
            password, nothing sent anywhere. Several people can share one tablet.
          </p>
        </div>
      </main>
    );
  }

  // ---- main screen --------------------------------------------------------

  return (
    <main className="page">
      <div className="shell home">
        <h1 className="home__title">Bible Story Puzzle</h1>
        <p className="home__tagline">
          Discover Scripture through some of the Bible&rsquo;s greatest stories.
        </p>

        {profile && (
          <div className="whoami">
            <span>
              Playing as <strong>{profile.name}</strong>
              {stars > 0 && <span className="whoami__stars"> · {stars} ★</span>}
            </span>
            <button type="button" className="btn btn--ghost" onClick={() => setSwitching(true)}>
              Switch
            </button>
          </div>
        )}

        <h2 className="picker__heading">How many puzzles?</h2>
        <div className="lengths" role="group" aria-label="Choose how many puzzles to play">
          {LENGTHS.map((l) => (
            <button
              key={l.rounds}
              type="button"
              className="length"
              aria-pressed={length === l.rounds}
              onClick={() => setLength(l.rounds)}
            >
              <span className="length__n">{l.rounds}</span>
              <span className="length__label">{l.label}</span>
              <span className="length__mins">{l.minutes}</span>
            </button>
          ))}
        </div>

        <h2 className="picker__heading">Choose your level</h2>
        <div className="modes" role="group" aria-label="Choose a level">
          {MODE_ORDER.map((id, i) => {
            const m = MODES[id];
            return (
              <button
                key={id}
                type="button"
                className="mode"
                aria-pressed={mode === id}
                onClick={() => setMode(id)}
              >
                <span className="mode__pips" aria-hidden="true">
                  {MODE_ORDER.map((_, p) => (
                    <span key={p} className={`mode__pip${p <= i ? ' mode__pip--on' : ''}`} />
                  ))}
                </span>
                <span className="mode__text">
                  <span className="mode__name">
                    {m.label}
                    <span className="mode__tag">{m.tagline}</span>
                  </span>
                  <span className="mode__desc">{m.description}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="home__cta">
          <button type="button" className="btn btn--primary" onClick={play}>
            Play {length} puzzles
          </button>
          <p className="home__best">
            {best
              ? `Your best at ${MODES[mode].label} · ${length}: ${best.score.toLocaleString()}`
              : `No score yet at ${MODES[mode].label} · ${length}`}
          </p>
        </div>

        <div className="home__foot">
          <Link className="btn btn--ghost" href="/library/">
            Story library
          </Link>
        </div>

        <p className="home__note">
          No adverts, nothing collected, nothing sent anywhere. Scores stay on this device.
          <br />
          Works offline once loaded &mdash; made for classrooms with bad wifi.
        </p>
      </div>
    </main>
  );
}
