'use client';

import { useEffect } from 'react';
import type { GridSize, RoundResult, Story } from '@/types';
import ProgressRail from './ProgressRail';

interface Props {
  story: Story;
  roundIndex: number;
  totalRounds: number;
  grid: GridSize;
  seconds: number;
  results: RoundResult[];
  onBegin: () => void;
}

const BRIEFING_MS = 2600;

/**
 * No image preview here on purpose - the picture is the puzzle.
 */
export default function RoundIntro({
  story,
  roundIndex,
  totalRounds,
  grid,
  seconds,
  results,
  onBegin,
}: Props) {
  useEffect(() => {
    const t = setTimeout(onBegin, BRIEFING_MS);
    return () => clearTimeout(t);
  }, [roundIndex, onBegin]);

  return (
    <div
      className="briefing"
      onClick={onBegin}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onBegin();
      }}
      aria-label={`Round ${roundIndex + 1} of ${totalRounds}, ${story.title}. Tap to start.`}
    >
      <p className="briefing__round">
        Round {roundIndex + 1} of {totalRounds}
      </p>
      <h2 className="briefing__title">{story.title}</h2>
      <p className="briefing__grid">
        {grid} &times; {grid} &middot; {seconds} seconds
      </p>
      <ProgressRail results={results} current={roundIndex} total={totalRounds} />
    </div>
  );
}
