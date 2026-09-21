'use client';

import Link from 'next/link';
import type { GameMode, RoundResult } from '@/types';
import { STORIES } from '@/content/stories';
import { goldStarCount, rankFor, totalScore } from '@/game/scoring';

interface Props {
  results: RoundResult[];
  mode: GameMode;
  newBest: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

export default function ResultsScreen({ results, mode, newBest, onPlayAgain, onHome }: Props) {
  const score = totalScore(results);
  const stars = goldStarCount(results);
  const rank = rankFor(score);
  const solved = results.filter((r) => r.solved).length;

  const share = () => {
    const text = `Bible Story Puzzle - ${mode.label}\n${score} points, ${rank.name}\n${solved}/20 solved, ${stars} gold stars`;
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div className="results">
      <p className="hud__label">{mode.label} &middot; final score</p>
      <div className="results__score">{score.toLocaleString()}</div>
      <h2 className="results__rank">{rank.name}</h2>
      <p className="results__blurb">{rank.blurb}</p>

      {newBest && <p className="results__best">New personal best</p>}

      <p className="results__stars">
        {solved} of 20 solved &middot; {stars} gold {stars === 1 ? 'star' : 'stars'}
      </p>

      <div className="play__actions">
        <button type="button" className="btn btn--primary" onClick={onPlayAgain}>
          Play again
        </button>
        <Link className="btn" href="/library/">
          Read the stories
        </Link>
        <button type="button" className="btn btn--ghost" onClick={share}>
          Copy score
        </button>
        <button type="button" className="btn btn--ghost" onClick={onHome}>
          Home
        </button>
      </div>

      <div className="breakdown">
        {results.map((r) => {
          const story = STORIES.find((s) => s.id === r.storyId);
          if (!story) return null;
          return (
            <div key={r.storyId} className={`row${r.goldStar ? ' row--star' : ''}`}>
              <div
                className="row__thumb"
                style={{ backgroundImage: `url(${story.thumb})` }}
                aria-hidden="true"
              />
              <div className="row__main">
                <div className="row__title">
                  {r.goldStar ? '★ ' : ''}
                  {story.title}
                </div>
                <div className="row__ref">
                  {story.reference} &middot;{' '}
                  {r.solved ? `solved in ${Math.round(r.secondsUsed)}s` : `${r.correctTiles}/${r.totalTiles} placed`}
                </div>
              </div>
              <div className="row__score">{r.score}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
