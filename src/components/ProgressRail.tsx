'use client';

import type { RoundResult } from '@/types';
import { TOTAL_ROUNDS } from '@/content/stories';

export default function ProgressRail({
  results,
  current,
}: {
  results: RoundResult[];
  current: number;
}) {
  return (
    <div className="rail" aria-label={`Round ${current + 1} of ${TOTAL_ROUNDS}`}>
      {Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
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
