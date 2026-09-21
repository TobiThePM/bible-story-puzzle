'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, currentStory, runningScore, lastResult } from '@/game/store';
import { useTimer } from '@/game/useTimer';
import { STORIES, TOTAL_ROUNDS } from '@/content/stories';
import PuzzleBoard from './PuzzleBoard';
import TimerRing from './TimerRing';
import StoryCard from './StoryCard';
import RoundIntro from './RoundIntro';
import ResultsScreen from './ResultsScreen';
import ProgressRail from './ProgressRail';

export default function GameHost() {
  const router = useRouter();
  const s = useGame();

  const story = currentStory(s);
  const score = runningScore(s);
  const result = lastResult(s);

  // The clock only runs while actually playing.
  useTimer(s.phase === 'playing', s.tick);

  // Preload the next round's picture during the story card, so the next
  // puzzle never waits on a download.
  useEffect(() => {
    if (s.phase !== 'storyCard') return;
    const next = STORIES[s.roundIndex + 1];
    if (next) {
      const img = new Image();
      img.src = next.image;
    }
  }, [s.phase, s.roundIndex]);

  // Peek auto-closes.
  useEffect(() => {
    if (!s.peeking) return;
    const t = setTimeout(s.endPeek, s.mode.peekSeconds * 1000);
    return () => clearTimeout(t);
  }, [s.peeking, s.mode.peekSeconds, s.endPeek]);

  // Deep-linked or refreshed into /play with no game running.
  useEffect(() => {
    if (s.phase === 'idle') router.replace('/');
  }, [s.phase, router]);

  if (s.phase === 'idle') return null;

  if (s.phase === 'results') {
    return (
      <ResultsScreen
        results={s.results}
        mode={s.mode}
        newBest={s.newBest}
        onPlayAgain={() => s.startGame(s.mode.id)}
        onHome={() => {
          s.quit();
          router.push('/');
        }}
      />
    );
  }

  if (s.phase === 'storyCard') {
    return (
      <StoryCard
        story={story}
        result={result}
        seconds={s.mode.storyCardSeconds}
        paused={s.storyCardPaused}
        isLastRound={s.roundIndex + 1 >= TOTAL_ROUNDS}
        onTogglePause={s.toggleStoryCardPause}
        onAdvance={s.advance}
      />
    );
  }

  if (s.phase === 'briefing') {
    return (
      <RoundIntro
        story={story}
        roundIndex={s.roundIndex}
        grid={s.grid}
        seconds={s.secondsLimit}
        results={s.results}
        onBegin={s.beginRound}
      />
    );
  }

  // playing | solved | timedOut
  const remaining = Math.max(0, s.secondsLimit - s.secondsUsed);

  return (
    <>
      <div className="hud">
        <div className="hud__block">
          <div className="hud__label">Round</div>
          <div className="hud__value">
            {s.roundIndex + 1}
            <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>/{TOTAL_ROUNDS}</span>
          </div>
        </div>

        <TimerRing secondsRemaining={remaining} secondsLimit={s.secondsLimit} />

        <div className="hud__block hud__right">
          <div className="hud__label">Score</div>
          <div className="hud__value">{score.toLocaleString()}</div>
        </div>
      </div>

      <PuzzleBoard
        tiles={s.tiles}
        grid={s.grid}
        image={story.image}
        alt={story.alt}
        solved={s.phase === 'solved'}
        peeking={s.peeking}
        interactive={s.phase === 'playing'}
        onSwap={s.swapTiles}
      />

      <div className="play__actions">
        {s.mode.peekEnabled && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={s.peek}
            disabled={s.phase !== 'playing' || s.peeking}
          >
            Peek
            {s.mode.peekPenalty > 0 ? ` (-${s.mode.peekPenalty})` : ''}
          </button>
        )}
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            s.quit();
            router.push('/');
          }}
        >
          Quit
        </button>
      </div>

      <ProgressRail results={s.results} current={s.roundIndex} />

      <p className="hint">
        Drag one piece onto another to swap them &middot; or tap one, then tap another
      </p>

      <p className="sr-only" aria-live="polite">
        {s.phase === 'solved' ? 'Picture complete' : ''}
      </p>
    </>
  );
}
