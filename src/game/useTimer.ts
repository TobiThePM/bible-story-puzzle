'use client';

import { useEffect, useRef } from 'react';

/**
 * Wall-clock timer driven by requestAnimationFrame.
 *
 * Deliberately NOT setInterval incrementing a counter: background tabs throttle
 * intervals and slow phones drop them, so a counter drifts badly. Reading
 * performance.now() each frame means the clock is always truthful even if
 * frames are missed.
 *
 * Side effect, and a welcome one: the browser suspends rAF while the tab is
 * hidden, so the clock pauses if a child locks the phone or switches apps
 * mid-round rather than running down in their pocket. Verified in the browser -
 * document.hidden stops the countdown, and it resumes on return.
 */
export function useTimer(active: boolean, onTick: (secondsElapsed: number) => void): void {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const started = performance.now();

    const loop = () => {
      onTickRef.current((performance.now() - started) / 1000);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [active]);
}
