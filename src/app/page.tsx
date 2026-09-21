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
import { getBest, getLastMode, getLastLength } from '@/game/storage';
import type { ModeId, SessionLength } from '@/types';

export default function Home() {
  const router = useRouter();
  const startGame = useGame((s) => s.startGame);

  const [mode, setMode] = useState<ModeId>(DEFAULT_MODE);
  const [length, setLength] = useState<SessionLength>(DEFAULT_LENGTH);
  const [bests, setBests] = useState<Record<string, number>>({});

  // localStorage is read after mount so the static HTML stays identical for
  // every visitor (no hydration mismatch).
  useEffect(() => {
    const savedMode = getLastMode() ?? DEFAULT_MODE;
    const savedLength = getLastLength();
    setMode(savedMode);
    if (savedLength !== null && isSessionLength(savedLength)) setLength(savedLength);

    const found: Record<string, number> = {};
    for (const id of MODE_ORDER) {
      for (const l of LENGTHS) {
        const best = getBest(id, l.rounds);
        if (best) found[`${id}.${l.rounds}`] = best.score;
      }
    }
    setBests(found);
  }, []);

  const play = () => {
    startGame(mode, length);
    router.push('/play/');
  };

  const best = bests[`${mode}.${length}`];

  return (
    <main className="page">
      <div className="shell home">
        <h1 className="home__title">Bible Story Puzzle</h1>
        <p className="home__tagline">
          Discover Scripture through some of the Bible&rsquo;s greatest stories.
        </p>

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

        <h2 className="picker__heading">How hard?</h2>
        <div className="modes" role="group" aria-label="Choose a difficulty level">
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
          {best !== undefined && (
            <p className="home__best">
              Your best at {MODES[mode].label} &middot; {length}: {best.toLocaleString()}
            </p>
          )}
        </div>

        <div className="home__foot">
          <Link className="btn btn--ghost" href="/library/">
            Story library
          </Link>
        </div>

        <p className="home__note">
          No account, no adverts, nothing collected. Scores stay on this device.
          <br />
          Works offline once loaded &mdash; made for classrooms with bad wifi.
        </p>
      </div>
    </main>
  );
}
