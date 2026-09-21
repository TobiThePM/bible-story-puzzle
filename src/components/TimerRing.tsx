'use client';

interface Props {
  secondsRemaining: number;
  secondsLimit: number;
  size?: number;
}

/**
 * Depletion is shown by the ring emptying as well as by colour, because
 * young children read a shrinking arc far faster than they read digits -
 * and because colour alone must never carry information (WCAG).
 */
export default function TimerRing({ secondsRemaining, secondsLimit, size = 64 }: Props) {
  const fraction = secondsLimit > 0 ? Math.max(0, Math.min(1, secondsRemaining / secondsLimit)) : 0;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;

  const level = fraction <= 0.15 ? 'danger' : fraction <= 0.4 ? 'warn' : 'ok';
  const display = Math.ceil(secondsRemaining);

  return (
    <div className={`timer timer--${level}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle
          className="timer__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={5}
        />
        <circle
          className="timer__fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="timer__text">{display}</div>
      <span className="sr-only" role="timer" aria-live="off">
        {display} seconds remaining
      </span>
    </div>
  );
}
