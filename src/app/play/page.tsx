'use client';

import GameHost from '@/components/GameHost';

export default function PlayPage() {
  return (
    <main className="page">
      <div className="shell shell--center">
        <GameHost />
      </div>
    </main>
  );
}
