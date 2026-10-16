'use client';

import { useEffect, useState } from 'react';
import type { GridSize, RoundResult, Story } from '@/types';
import ProgressRail from './ProgressRail';

interface Props {
  story: Story;
  roundIndex: number;
  totalRounds: number;
  grid: GridSize;
  seconds: number;
  previewSeconds: number;
  results: RoundResult[];
  onBegin: () => void;
}

/**
 * v1 deliberately showed NO picture here - "the picture is the puzzle".
 *
 * Testers proved that wrong. They could not make sense of a scrambled image
 * before the clock ran out, and the round felt arbitrary rather than fair. So
 * the briefing now shows the finished painting for a few free seconds, like
 * the lid of a jigsaw box. Harder levels get a shorter look, which turns this
 * into a difficulty lever rather than a crutch.
 *
 * The clock does not start until this screen is gone.
 */
export default function RoundIntro({
  story,
  roundIndex,
  totalRounds,
  grid,
  seconds,
  previewSeconds,
  results,
  onBegin,
}: Props) {
  const [remaining, setRemaining] = useState(previewSeconds);

  useEffect(() => {
    setRemaining(previewSeconds);

    let frame = 0;
    const started = performance.now();

    const loop = () => {
      const left = previewSeconds - (performance.now() - started) / 1000;
      if (left <= 0) {
        onBegin();
        return;
      }
      setRemaining(left);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex, previewSeconds]);

  const pct = previewSeconds > 0 ? (remaining / previewSeconds) * 100 : 0;

  return (
    <div
      className="briefing"
      onClick={onBegin}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onBegin();
      }}
      aria-label={`Round ${roundIndex + 1} of ${totalRounds}, ${story.title}. ${story.alt} Tap to start early.`}
    >
      <p className="briefing__round">
        Round {roundIndex + 1} of {totalRounds}
      </p>

      <div
        className="briefing__image"
        style={{ backgroundImage: `url(${story.image})` }}
        role="img"
        aria-label={story.alt}
      />

      <h2 className="briefing__title">{story.title}</h2>

      <p className="briefing__grid">
        {grid} &times; {grid} &middot; {seconds} seconds to solve
      </p>

      <div className="briefing__bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="briefing__hint">Look closely &mdash; tap to start</p>

      <ProgressRail results={results} current={roundIndex} total={totalRounds} />
    </div>
  );
}
