'use client';

import type { RoundResult } from '@/types';

export default function ProgressRail({
  results,
  current,
  total,
}: {
  results: RoundResult[];
  current: number;
  total: number;
}) {
  return (
    <div className="rail" aria-label={`Round ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const r = results[i];
        const cls = [
          'rail__dot',
          r?.goldStar && 'rail__dot--star',
          r && !r.goldStar && 'rail__dot--done',
          i === current && 'rail__dot--now',
        ]
          .filter(Boolean)
          .join(' ');
        return <span key={i} className={cls} />;
      })}
    </div>
  );
}
