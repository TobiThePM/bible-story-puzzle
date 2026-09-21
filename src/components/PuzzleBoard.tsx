'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GridSize } from '@/types';
import { pieceRowCol } from '@/game/logic';

interface Props {
  tiles: number[];
  grid: GridSize;
  image: string;
  alt: string;
  solved: boolean;
  peeking: boolean;
  interactive: boolean;
  onSwap: (a: number, b: number) => void;
}

/**
 * THE IMAGE IS NEVER CUT INTO PIECES.
 *
 * There is one image file. Each tile is an empty box showing the whole image
 * as its background, offset so that only its own 1/Nth shows through. When
 * every tile is home the boxes sit edge to edge showing consecutive regions of
 * the same file - so the board simply IS the original picture, pixel for pixel.
 *
 * Offsets use percentages, not pixels, so the board is resolution independent:
 * it scales from a 320px phone to a projector with no JS measurement at all.
 */
function tileStyle(piece: number, grid: GridSize, image: string): React.CSSProperties {
  const { row, col } = pieceRowCol(piece, grid);
  const denom = grid - 1;
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: `${grid * 100}% ${grid * 100}%`,
    backgroundPosition: `${(col / denom) * 100}% ${(row / denom) * 100}%`,
  };
}

export default function PuzzleBoard({
  tiles,
  grid,
  image,
  alt,
  solved,
  peeking,
  interactive,
  onSwap,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null);

  // Pointer drag
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const startRef = useRef({ x: 0, y: 0 });

  // Keyboard / tap-tap
  const [focusIndex, setFocusIndex] = useState(0);
  const [lifted, setLifted] = useState<number | null>(null);

  useEffect(() => {
    // New round: clear any interaction state.
    setDragFrom(null);
    setDragOver(null);
    setLifted(null);
    setFocusIndex(0);
  }, [grid, image]);

  /** Which tile position is under a given client coordinate. */
  const positionAt = useCallback(
    (clientX: number, clientY: number): number | null => {
      const el = boardRef.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const col = Math.floor(((clientX - r.left) / r.width) * grid);
      const row = Math.floor(((clientY - r.top) / r.height) * grid);
      if (col < 0 || col >= grid || row < 0 || row >= grid) return null;
      return row * grid + col;
    },
    [grid]
  );

  const commitSwap = useCallback(
    (a: number, b: number) => {
      if (a !== b) onSwap(a, b);
    },
    [onSwap]
  );

  // ---- pointer ----

  const onPointerDown = (pos: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDragFrom(pos);
    setDragOver(pos);
    setOffset({ x: 0, y: 0 });
    setFocusIndex(pos);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragFrom === null) return;
    setOffset({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
    });
    setDragOver(positionAt(e.clientX, e.clientY));
  };

  const onPointerUp = (pos: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragFrom === null) return;

    const moved =
      Math.abs(e.clientX - startRef.current.x) > 6 || Math.abs(e.clientY - startRef.current.y) > 6;
    const target = positionAt(e.clientX, e.clientY);

    setDragFrom(null);
    setDragOver(null);
    setOffset({ x: 0, y: 0 });

    if (moved) {
      // A drag: swap with whatever is under the finger.
      if (target !== null) commitSwap(pos, target);
      setLifted(null);
      return;
    }

    // A tap: first tap lifts, second tap swaps. Works for anyone who finds
    // dragging hard - young children, shaky hands, a trackpad.
    if (lifted === null) setLifted(pos);
    else if (lifted === pos) setLifted(null);
    else {
      commitSwap(lifted, pos);
      setLifted(null);
    }
  };

  const onPointerCancel = () => {
    setDragFrom(null);
    setDragOver(null);
    setOffset({ x: 0, y: 0 });
  };

  // ---- keyboard ----

  const onKeyDown = (pos: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!interactive) return;

    const move = (delta: number) => {
      e.preventDefault();
      const next = Math.max(0, Math.min(grid * grid - 1, pos + delta));
      setFocusIndex(next);
      const el = boardRef.current?.querySelector<HTMLButtonElement>(`[data-pos="${next}"]`);
      el?.focus();
    };

    switch (e.key) {
      case 'ArrowRight':
        if (pos % grid < grid - 1) move(1);
        break;
      case 'ArrowLeft':
        if (pos % grid > 0) move(-1);
        break;
      case 'ArrowDown':
        move(grid);
        break;
      case 'ArrowUp':
        move(-grid);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (lifted === null) setLifted(pos);
        else if (lifted === pos) setLifted(null);
        else {
          commitSwap(lifted, pos);
          setLifted(null);
        }
        break;
      case 'Escape':
        setLifted(null);
        break;
    }
  };

  return (
    <div
      ref={boardRef}
      className={`board${solved ? ' board--solved' : ''}`}
      style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
      role="group"
      aria-label={`Picture puzzle, ${grid} by ${grid}. ${alt}`}
    >
      {tiles.map((piece, pos) => {
        const isDragging = dragFrom === pos;
        const isTarget = dragFrom !== null && dragOver === pos && dragOver !== dragFrom;
        const isLifted = lifted === pos;
        const atHome = piece === pos;

        const classes = [
          'tile',
          isDragging && 'tile--dragging',
          isTarget && 'tile--target',
          isLifted && 'tile--lifted',
          atHome && !solved && 'tile--home',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={pos}
            data-pos={pos}
            type="button"
            className={classes}
            style={{
              ...tileStyle(piece, grid, image),
              ...(isDragging
                ? { transform: `translate(${offset.x}px, ${offset.y}px) scale(1.06)` }
                : null),
            }}
            tabIndex={pos === focusIndex ? 0 : -1}
            aria-label={`Tile at row ${Math.floor(pos / grid) + 1}, column ${(pos % grid) + 1}${
              atHome ? ', in place' : ''
            }${isLifted ? ', picked up' : ''}`}
            aria-pressed={isLifted}
            disabled={!interactive}
            onPointerDown={onPointerDown(pos)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp(pos)}
            onPointerCancel={onPointerCancel}
            onKeyDown={onKeyDown(pos)}
            onContextMenu={(e) => e.preventDefault()}
          />
        );
      })}

      {peeking && (
        <div
          className="board__peek"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
