'use client';

import { Scrap, DoodleArrow, DoodleCircle } from './Scrapbook';
import { cldOptimize } from '@/lib/cloudinary';

function Tagline({ words }) {
  // words: e.g. ["Code", "should", "*just*", "work."] — wrap *word* as accent
  return (
    <h1 className="tagline" aria-label={words.map((w) => w.replace(/\*/g, '')).join(' ')}>
      {words.map((w, i) => {
        // *word* = accent (terra + larger); **word** = accent + hand-drawn underline
        const scribble = /^\*\*.+\*\*$/.test(w);
        const isAccent = scribble || /^\*.+\*$/.test(w);
        const text = w.replace(/^\*+|\*+$/g, '');
        const cls = 'w' + (isAccent ? ' accent' : '') + (scribble ? ' scribble' : '');
        return (
          <span key={i} className={cls}>
            {text}
          </span>
        );
      })}
    </h1>
  );
}

function AvailabilityStrip({ status, responseTime, engagement }) {
  return (
    <div className="avail-card" role="group" aria-label="Availability and engagement">
      <span className="avail-tape" aria-hidden="true"></span>
      <div className="avail-item">
        <span className="avail-dot" aria-hidden="true"></span>
        <span>
          <strong>{status}</strong> · {responseTime}
        </span>
      </div>
      <div className="avail-item">
        <span className="avail-glyph" aria-hidden="true">◆</span>
        <span>{engagement}</span>
      </div>
    </div>
  );
}

function SkillTag({ label, color = 'paper', rot = 0, tape = false, pinned = false }) {
  return (
    <span
      className={`skill-tag tag-${color} ${pinned ? 'is-pinned' : ''}`}
      style={{ '--rot': `${rot}deg` }}
    >
      {tape && <span className="tag-tape" aria-hidden="true"></span>}
      <span className="tag-dot" aria-hidden="true"></span>
      {label}
    </span>
  );
}

function SkillTags({ tags }) {
  return (
    <div className="skill-tags-block">
      <span className="skill-tags-label">— what I ship most</span>
      <div className="skill-tags" aria-label="Skills and highlights">
        {tags.map((t, i) => (
          <SkillTag key={t.label + i} {...t} />
        ))}
      </div>
    </div>
  );
}

function TestimonialScrap({ data }) {
  const { quote, author, verified, position } = data;
  const p = position || {};
  return (
    <Scrap
      kind="lined"
      style={{
        position: 'absolute',
        top: p.top,
        right: p.right,
        width: p.width,
        transform: `rotate(calc(var(--wonk, 1) * ${p.rot || 0}deg))`,
        padding: '20px 22px 24px 48px',
        zIndex: 1,
      }}
      tapeTop={{ x: p.tapeX ?? 30, r: p.tapeR ?? 8 }}
    >
      <div style={{ fontFamily: 'Caveat', fontSize: 21, lineHeight: 1.25, color: 'var(--ink)' }}>
        "{quote}"
      </div>
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: 'var(--terra-deep)',
          marginTop: 10,
          letterSpacing: '0.06em',
        }}
      >
        {author}
      </div>
      {verified && (
        <div className="verified-chip" aria-label="Verified client">
          <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
            <path
              d="M3 8.5 L 7 12 L 13 4"
              stroke="#5A6B4E"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          verified client
        </div>
      )}
    </Scrap>
  );
}

function PortraitReveal({ portrait }) {
  return (
    <div className="portrait-wrap">
      <div className="portrait-frame">
        <div className="portrait-face" style={portrait ? { background: `url(${cldOptimize(portrait, 'f_auto,q_auto,w_640,c_fill')}) center/cover` } : undefined}>
          {!portrait && <span className="ph-label">portrait · drop your photo</span>}
        </div>
      </div>
      <span className="portrait-sig">— catching air, not bugs.</span>
    </div>
  );
}

function HeroArt({ testimonials, portrait, handnote }) {
  // After v2 swap: right column shows the portrait reveal as the face-of-the-page
  // identity signal. Optional handnote sits above with arrow doodle pointing
  // at the polaroid. Testimonial (if any) is still supported as a small overlay.
  const heroTestimonial = (testimonials || [])[0];
  return (
    <div className="hero-art">
      <DoodleCircle style={{ top: 30, left: 30, width: 380, height: 380, opacity: 0.15 }} color="terra" />

      {handnote && (
        <span
          style={{
            position: 'absolute',
            top: 14,
            right: 110,
            fontFamily: 'Caveat, cursive',
            fontSize: 22,
            color: 'var(--terra-deep)',
            whiteSpace: 'nowrap',
            transform: 'rotate(calc(var(--wonk, 1) * -2deg))',
            transformOrigin: 'top right',
            zIndex: 2,
          }}
        >
          {handnote}
        </span>
      )}

      <div
        style={{
          position: 'absolute',
          top: 85,
          right: 140,
          transform: 'rotate(calc(var(--wonk, 1) * 3deg))',
          zIndex: 1,
        }}
      >
        <PortraitReveal portrait={portrait} />
      </div>

      {heroTestimonial && <TestimonialScrap data={heroTestimonial} />}

      {/* doodle arrow sits where the "↓" character used to live — curving down
          from the end of the handnote (after "orange") into the polaroid */}
      {handnote && (
        <DoodleArrow
          style={{
            top: 48,
            right: 180,
            transform: 'rotate(calc(var(--wonk, 1) * 95deg))',
            zIndex: 3,
          }}
          color="terra"
        />
      )}
    </div>
  );
}

export default function Hero({ hero, skills }) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div>
          <span className="role-label">{hero.roleLabel}</span>
          <Tagline words={hero.tagline} />
          <div className="role-meta" dangerouslySetInnerHTML={{ __html: hero.roleMeta.replace(/·/g, '&nbsp;·&nbsp;') }} />
          <AvailabilityStrip {...hero.availability} />
          <p className="hero-intro">{hero.intro}</p>
          <SkillTags tags={skills} />
        </div>
        <HeroArt testimonials={hero.testimonials} portrait={hero.portrait} handnote={hero.handnote} />
      </div>
    </section>
  );
}
