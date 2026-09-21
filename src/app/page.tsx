'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MODES, MODE_ORDER, DEFAULT_MODE } from '@/content/modes';
import { TOTAL_ROUNDS } from '@/content/stories';
import { useGame } from '@/game/store';
import { getBest, getLastMode } from '@/game/storage';
import type { ModeId } from '@/types';

export default function Home() {
  const router = useRouter();
  const startGame = useGame((s) => s.startGame);

  const [selected, setSelected] = useState<ModeId>(DEFAULT_MODE);
  const [bests, setBests] = useState<Record<string, number>>({});

  // localStorage is read after mount so the static HTML stays identical for
  // every visitor (no hydration mismatch).
  useEffect(() => {
    setSelected(getLastMode() ?? DEFAULT_MODE);
    const found: Record<string, number> = {};
    for (const id of MODE_ORDER) {
      const best = getBest(id);
      if (best) found[id] = best.score;
    }
    setBests(found);
  }, []);

  const play = () => {
    startGame(selected);
    router.push('/play/');
  };

  return (
    <main className="page">
      <div className="shell home">
        <h1 className="home__title">Bible Story Puzzle</h1>
        <p className="home__tagline">
          Discover Scripture through some of the Bible&rsquo;s greatest stories.
        </p>

        <div className="modes" role="group" aria-label="Choose a difficulty level">
          {MODE_ORDER.map((id, i) => {
            const mode = MODES[id];
            const isOn = selected === id;
            return (
              <button
                key={id}
                type="button"
                className="mode"
                aria-pressed={isOn}
                onClick={() => setSelected(id)}
              >
                <span className="mode__pips" aria-hidden="true">
                  {MODE_ORDER.map((_, p) => (
                    <span key={p} className={`mode__pip${p <= i ? ' mode__pip--on' : ''}`} />
                  ))}
                </span>
                <span className="mode__text">
                  <span className="mode__name">
                    {mode.label}
                    <span className="mode__tag">{mode.tagline}</span>
                  </span>
                  <span className="mode__desc">{mode.description}</span>
                  {bests[id] !== undefined && (
                    <span className="mode__best">Best: {bests[id].toLocaleString()}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="home__cta">
          <button type="button" className="btn btn--primary" onClick={play}>
            Play {TOTAL_ROUNDS} stories
          </button>
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
