'use client';

import { useEffect, useRef, useState } from 'react';
import type { RoundResult, Story } from '@/types';

interface Props {
  story: Story;
  result: RoundResult | undefined;
  seconds: number;
  paused: boolean;
  isLastRound: boolean;
  onTogglePause: () => void;
  onAdvance: () => void;
}

/**
 * The point of the whole game.
 *
 * The puzzle is the hook; this screen is why the game exists. A teacher must
 * be able to hold it open and talk about the story, so auto-advance is
 * pausable - the single most important affordance for classroom use.
 */
export default function StoryCard({
  story,
  result,
  seconds,
  paused,
  isLastRound,
  onTogglePause,
  onAdvance,
}: Props) {
  const [elapsed, setElapsed] = useState(0);
  const advancedRef = useRef(false);

  useEffect(() => {
    advancedRef.current = false;
    setElapsed(0);
  }, [story.id]);

  useEffect(() => {
    if (paused) return;

    let frame = 0;
    const started = performance.now() - elapsed * 1000;

    const loop = () => {
      const next = (performance.now() - started) / 1000;
      setElapsed(next);
      if (next >= seconds) {
        if (!advancedRef.current) {
          advancedRef.current = true;
          onAdvance();
        }
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, seconds, story.id]);

  const progress = Math.min(100, (elapsed / seconds) * 100);
  const solved = result?.solved ?? false;

  return (
    <div className="story">
      <div
        className="story__image"
        style={{ backgroundImage: `url(${story.image})` }}
        role="img"
        aria-label={story.alt}
      />

      <p className={`story__verdict ${solved ? 'story__verdict--good' : 'story__verdict--miss'}`}>
        {solved
          ? result?.goldStar
            ? 'Gold star'
            : 'Solved'
          : `Time's up - ${result?.correctTiles ?? 0} of ${result?.totalTiles ?? 0} in place`}
        {result ? ` · +${result.score}` : ''}
      </p>

      <h2 className="story__title">{story.title}</h2>
      <p className="story__ref">{story.reference}</p>
      <p className="story__retelling">{story.retelling}</p>

      <blockquote className="story__verse">
        &ldquo;{story.verse}&rdquo;
        <cite>{story.verseReference}</cite>
      </blockquote>

      <div className="story__bar" aria-hidden="true">
        <span style={{ width: `${paused ? progress : progress}%` }} />
      </div>

      <div className="play__actions">
        <button type="button" className="btn btn--ghost" onClick={onTogglePause}>
          {paused ? 'Resume' : 'Pause to talk about it'}
        </button>
        <button type="button" className="btn" onClick={onAdvance}>
          {isLastRound ? 'See your score' : 'Next story'}
        </button>
      </div>
    </div>
  );
}
