'use client';

import { useState, useEffect, useRef } from 'react';
import { useDraggable, DoodleArrow } from './Scrapbook';
import SectionHeading from './SectionHeading';
import { cldThumb, cldOptimize } from '@/lib/cloudinary';

function WorkCard({ item, z, onOpen }) {
  const { pos, drag, onDown } = useDraggable({ x: item.x, y: item.y });
  // Distinguish a real click (open modal) from the end of a drag (just move).
  const downAt = useRef(null);

  const handleDown = (e) => {
    const t = (e.touches && e.touches[0]) || e;
    downAt.current = { x: t.clientX, y: t.clientY };
    // Below the collage width the board is a static vertical stack — don't start a
    // drag (it would hijack touch-scrolling). Tapping still opens the case study.
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1220px)').matches) return;
    onDown(e);
  };
  const handleClick = (e) => {
    if (!downAt.current) return onOpen();
    const moved = Math.hypot(e.clientX - downAt.current.x, e.clientY - downAt.current.y);
    if (moved < 6) onOpen();
  };

  return (
    <div
      className={'work-card has-link ' + (drag ? 'dragging' : '')}
      style={{
        width: item.w,
        height: item.h,
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(calc(var(--wonk, 1) * ${item.r}deg))`,
        zIndex: drag ? 99 : z ?? 1,
      }}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      onClick={handleClick}
    >
      <div className="thumb" style={{ background: item.thumbFit === 'contain' ? item.bg : undefined }}>
        {item.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cldThumb(item.thumb, Math.round(item.w * 2))}
            alt={item.client}
            style={{ width: '100%', height: '100%', objectFit: item.thumbFit || 'cover' }}
          />
        ) : (
          <div className="ph" style={{ '--ph-bg': item.bg }}></div>
        )}
        <span className="work-open" aria-hidden="true">View <span className="arr">↗</span></span>
      </div>
      <div className="work-meta">
        <span className="client">{item.client}</span>
        <span className="outcome">{item.outcome}</span>
      </div>
      {item.badge && <span className={'work-badge work-badge--' + item.badge.kind}>{item.badge.label}</span>}
    </div>
  );
}

function WorkModal({ item, onClose }) {
  // Admin "Remove" clears a value but keeps the array entry, so without
  // this filter we'd render <img src=""> and get a broken-image icon.
  const shots = (item.shots || []).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const hasMany = shots.length > 1;
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const clamp = (i) => Math.max(0, Math.min(shots.length - 1, i));
  const popRef = useRef(null);
  const btnRef = useRef(null);
  const touchStart = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (summaryOpen) setSummaryOpen(false);
        else onClose();
      } else if (e.key === 'ArrowRight') {
        setIdx((i) => clamp(i + 1));
      } else if (e.key === 'ArrowLeft') {
        setIdx((i) => clamp(i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, shots.length, summaryOpen]);

  // Close summary popover on outside click.
  useEffect(() => {
    if (!summaryOpen) return;
    const onDocDown = (e) => {
      if (popRef.current?.contains(e.target)) return;
      if (btnRef.current?.contains(e.target)) return;
      setSummaryOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [summaryOpen]);

  const next = () => setIdx((i) => clamp(i + 1));
  const prev = () => setIdx((i) => clamp(i - 1));

  // Mobile: drag the image with your finger; release past a threshold to page.
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, w: e.currentTarget.clientWidth, horiz: false };
    setDragging(true);
    setDragX(0);
  };
  const onTouchMove = (e) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (!touchStart.current.horiz && Math.abs(dx) <= Math.abs(dy)) return; // let vertical scroll pass
    touchStart.current.horiz = true;
    const atEdge = (idx === 0 && dx > 0) || (idx === shots.length - 1 && dx < 0);
    setDragX(atEdge ? dx * 0.35 : dx); // resistance past the first/last slide
  };
  const onTouchEnd = () => {
    if (!touchStart.current) return;
    const w = touchStart.current.w || window.innerWidth;
    const d = dragX;
    touchStart.current = null;
    setDragging(false);
    const threshold = Math.min(80, w * 0.2);
    if (d <= -threshold) setIdx((i) => clamp(i + 1));
    else if (d >= threshold) setIdx((i) => clamp(i - 1));
    setDragX(0);
  };

  return (
    <div className="work-modal-overlay" onClick={onClose}>
      <div className="work-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={item.client}>
        <button className="work-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div
          className="work-modal-stage"
          style={item.bg ? { background: item.bg } : undefined}
          onTouchStart={hasMany ? onTouchStart : undefined}
          onTouchMove={hasMany ? onTouchMove : undefined}
          onTouchEnd={hasMany ? onTouchEnd : undefined}
        >
          {shots.length ? (
            <>
              <div
                className="work-modal-track"
                style={{
                  transform: `translateX(calc(${-idx * 100}% + ${dragX}px))`,
                  transition: dragging ? 'none' : 'transform 0.32s cubic-bezier(.22,.61,.36,1)',
                }}
              >
                {shots.map((s, i) => (
                  <div className="work-modal-slide" key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cldOptimize(s, 'f_auto,q_auto,w_1600')}
                      alt={`${item.client} — screenshot ${i + 1}`}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
              {hasMany && (
                <>
                  <button className="work-modal-nav work-modal-nav--prev" onClick={prev} aria-label="Previous screenshot">‹</button>
                  <button className="work-modal-nav work-modal-nav--next" onClick={next} aria-label="Next screenshot">›</button>
                  <div className="work-modal-dots" role="tablist">
                    {shots.map((_, i) => (
                      <button
                        key={i}
                        className={'work-modal-dot' + (i === idx ? ' is-active' : '')}
                        onClick={() => setIdx(i)}
                        aria-label={`Screenshot ${i + 1}`}
                        aria-selected={i === idx}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="work-modal-placeholder" style={{ '--ph-bg': item.bg }}>
              <span>{item.label}</span>
            </div>
          )}
        </div>

        <div className="work-modal-info">
          <div className="work-modal-info-main">
            <div className="work-modal-tech">{item.label}</div>
            <h3 className="work-modal-title">{item.client}</h3>
          </div>
          <div className="work-modal-info-side">
            <div className="work-modal-outcome">{item.outcome}</div>
            {item.summary && (
              <>
                <button
                  ref={btnRef}
                  type="button"
                  className={'work-modal-info-btn' + (summaryOpen ? ' is-open' : '')}
                  onClick={() => setSummaryOpen((v) => !v)}
                  aria-label="Project details"
                  aria-expanded={summaryOpen}
                >ⓘ</button>
                {summaryOpen && (
                  <div ref={popRef} className="work-modal-summary-pop" role="tooltip">
                    {item.summary}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function lede(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p) ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
}

export default function Work({ work }) {
  const [active, setActive] = useState(null);

  return (
    <section className="work" id="work">
      <span className="section-mark">{work.mark}</span>
      <SectionHeading heading={work.heading} accent={work.headingAccent} />
      <p className="work-lede">{lede(work.lede)}</p>
      <div className="board" aria-label="A board of work screenshots arranged organically">
        <span className="board-tag">drag or tap any card →</span>
        {work.items.map((it, i) => (
          <WorkCard
            key={i}
            item={it}
            z={it.badge?.kind === 'featured' ? 20 + i : i + 1}
            onOpen={() => setActive(it)}
          />
        ))}
        <DoodleArrow style={{ bottom: 15, right: 70, transform: 'rotate(calc(var(--wonk, 1) * 140deg))' }} />
      </div>
      <div style={{ marginTop: 18, fontFamily: 'Caveat, cursive', fontSize: 22, color: 'var(--ink-mute)', textAlign: 'right' }}>
        {work.footnote}
      </div>

      {active && <WorkModal item={active} onClose={() => setActive(null)} />}
    </section>
  );
}
