import { describe, it, expect } from 'vitest';
import { scoreRound, totalScore, goldStarCount, rankFor, type RoundScoreInput } from '@/game/scoring';

const base: RoundScoreInput = {
  storyId: 'jericho',
  roundIndex: 9,
  grid: 4,
  solved: true,
  correctTiles: 16,
  totalTiles: 16,
  secondsUsed: 40,
  secondsLimit: 60,
  peeksUsed: 0,
  peekPenalty: 25,
};

describe('scoreRound', () => {
  it('scores a straightforward solve', () => {
    // 100 completion + 20s remaining * 5 = 200. No gold star (used 2/3 of clock).
    const r = scoreRound(base);
    expect(r.score).toBe(200);
    expect(r.goldStar).toBe(false);
  });

  it('awards a gold star for a fast, peek-free solve', () => {
    // 30s of a 60s limit -> exactly half -> qualifies.
    const r = scoreRound({ ...base, secondsUsed: 30 });
    expect(r.goldStar).toBe(true);
    expect(r.score).toBe(100 + 30 * 5 + 50);
  });

  it('denies a gold star if the player peeked', () => {
    const r = scoreRound({ ...base, secondsUsed: 20, peeksUsed: 1 });
    expect(r.goldStar).toBe(false);
  });

  it('gives partial credit when the timer runs out', () => {
    // 12 of 16 tiles home -> round(60 * 12/16) = 45. No time bonus.
    const r = scoreRound({
      ...base,
      solved: false,
      correctTiles: 12,
      secondsUsed: 60,
    });
    expect(r.score).toBe(45);
    expect(r.solved).toBe(false);
  });

  it('gives zero for a timeout with nothing placed', () => {
    const r = scoreRound({ ...base, solved: false, correctTiles: 0, secondsUsed: 60 });
    expect(r.score).toBe(0);
  });

  it('subtracts the peek penalty', () => {
    const r = scoreRound({ ...base, peeksUsed: 2 });
    expect(r.score).toBe(200 - 50);
  });

  it('never returns a negative score', () => {
    const r = scoreRound({
      ...base,
      solved: false,
      correctTiles: 0,
      secondsUsed: 60,
      peeksUsed: 10,
    });
    expect(r.score).toBe(0);
  });

  it('applies no penalty when the mode has none (Little Ones)', () => {
    const r = scoreRound({ ...base, peeksUsed: 5, peekPenalty: 0 });
    expect(r.score).toBe(200);
  });

  it('is deterministic', () => {
    expect(scoreRound(base)).toEqual(scoreRound(base));
  });
});

describe('totals', () => {
  const results = [
    scoreRound({ ...base, secondsUsed: 30 }),
    scoreRound({ ...base, secondsUsed: 55 }),
    scoreRound({ ...base, solved: false, correctTiles: 8, secondsUsed: 60 }),
  ];

  it('sums round scores', () => {
    expect(totalScore(results)).toBe(results[0].score + results[1].score + results[2].score);
  });

  it('counts gold stars', () => {
    expect(goldStarCount(results)).toBe(1);
  });
});

describe('rankFor', () => {
  // Ranks judge the AVERAGE per round, so a short game is as winnable as a long one.
  it('maps a 20-round score to the right rank', () => {
    expect(rankFor(0, 20).name).toBe('Seeker');
    expect(rankFor(1499, 20).name).toBe('Seeker');
    expect(rankFor(1500, 20).name).toBe('Student');
    expect(rankFor(3000, 20).name).toBe('Scribe');
    expect(rankFor(4500, 20).name).toBe('Watchman');
    expect(rankFor(6000, 20).name).toBe('Champion');
    expect(rankFor(7000, 20).name).toBe('Faithful Witness');
  });

  it('gives the same rank for the same standard of play at any length', () => {
    for (const rounds of [5, 10, 20]) {
      expect(rankFor(350 * rounds, rounds).name, String(rounds)).toBe('Faithful Witness');
      expect(rankFor(150 * rounds, rounds).name, String(rounds)).toBe('Scribe');
      expect(rankFor(10 * rounds, rounds).name, String(rounds)).toBe('Seeker');
    }
  });

  // The bug this guards: with total-based thresholds a perfect five-round
  // game scored ~1,850 and ranked 'Student' forever.
  it('lets a strong five-round game reach the top rank', () => {
    expect(rankFor(1850, 5).name).toBe('Faithful Witness');
  });

  it('handles zero rounds without dividing by zero', () => {
    expect(rankFor(0, 0).name).toBe('Seeker');
  });
});
