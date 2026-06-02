'use client';

import { useState, useRef, useEffect } from 'react';

export function ScribbleUnderline() {
  return (
    <svg className="underline" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 8 C 18 2, 32 12, 50 6 S 88 12, 118 5" />
    </svg>
  );
}

export function Scrap({ children, kind = 'plain', tapeTop, tapeBottom, style, className = '' }) {
  return (
    <div className={'scrap ' + (kind ? 'note-' + kind + ' ' : '') + className} style={style}>
      <svg className="scrap-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="0" width="100" height="100" />
      </svg>
      {kind === 'lined' && (
        <>
          <span className="red-margin"></span>
          <div
            className="lines"
            style={{
              backgroundImage:
                'repeating-linear-gradient(transparent 0 25px, rgba(64,80,160,0.25) 25px 26px)',
            }}
          ></div>
        </>
      )}
      {kind === 'grid' && <div className="grid"></div>}
      {tapeTop && (
        <span
          className="tape"
          style={{
            top: -6,
            left: tapeTop.x ?? 20,
            transform: `rotate(calc(var(--wonk, 1) * ${tapeTop.r ?? -8}deg))`,
          }}
        ></span>
      )}
      {tapeBottom && (
        <span
          className="tape"
          style={{
            bottom: -6,
            right: tapeBottom.x ?? 20,
            transform: `rotate(calc(var(--wonk, 1) * ${tapeBottom.r ?? 6}deg))`,
          }}
        ></span>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

export function DoodleArrow({ style, color = 'ink' }) {
  return (
    <svg className={'doodle ' + (color === 'terra' ? 'terra' : '')} style={style} width="80" height="50" viewBox="0 0 80 50" aria-hidden="true">
      <path d="M5 30 C 18 8, 38 6, 58 18 C 65 22, 70 26, 74 30" />
      <path d="M68 22 L 74 30 L 64 32" />
    </svg>
  );
}

export function DoodleStar({ style, color = 'terra' }) {
  return (
    <svg className={'doodle ' + (color === 'terra' ? 'terra' : '')} style={style} width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <path d="M17 3 L 19.5 13 L 30 14 L 21 20 L 24 31 L 17 24 L 10 31 L 13 20 L 4 14 L 14.5 13 Z" />
    </svg>
  );
}

export function DoodleSquiggle({ style, color = 'ink' }) {
  return (
    <svg className={'doodle ' + (color === 'terra' ? 'terra' : '')} style={style} width="120" height="20" viewBox="0 0 120 20" aria-hidden="true">
      <path d="M2 10 Q 12 0, 22 10 T 42 10 T 62 10 T 82 10 T 102 10 T 118 10" />
    </svg>
  );
}

export function DoodleCircle({ style, color = 'terra' }) {
  return (
    <svg className={'doodle ' + (color === 'terra' ? 'terra' : '')} style={style} width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
      <path d="M40 6 C 18 10, 6 28, 10 50 C 14 70, 42 78, 60 70 C 76 62, 78 36, 68 22 C 60 10, 50 6, 40 6 Z" />
    </svg>
  );
}

export function useDraggable(initial) {
  const [pos, setPos] = useState(initial);
  const [drag, setDrag] = useState(false);
  const start = useRef(null);

  const onDown = (e) => {
    e.preventDefault();
    const t = (e.touches && e.touches[0]) || e;
    start.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
    setDrag(true);
  };
  useEffect(() => {
    if (!drag) return;
    const move = (e) => {
      const t = (e.touches && e.touches[0]) || e;
      setPos({ x: t.clientX - start.current.x, y: t.clientY - start.current.y });
    };
    const up = () => setDrag(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [drag]);

  return { pos, setPos, drag, onDown };
}
