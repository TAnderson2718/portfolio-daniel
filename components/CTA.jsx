'use client';

import { useState } from 'react';
import SectionHeading from './SectionHeading';
import ContactModal from './ContactModal';

function FillingSketch({ checked }) {
  return (
    <svg className="sketch-svg" viewBox="0 0 320 320" fill="none">
      <g filter="url(#inkRough)">
        <path className="sketch-base" d="M30 250 L 290 250" />
        <path className="sketch-base" d="M50 250 L 60 290 M 270 250 L 260 290" />

        <g>
          <path className={'sketch-layer ' + (checked[0] ? 'on' : '')} strokeWidth="2.6" d="M30 250 L 290 250 L 290 256 L 30 256 Z" />
          <path
            className={'sketch-layer ' + (checked[0] ? 'on' : '')}
            strokeWidth="2.4"
            d="M90 250 L 90 200 L 230 200 L 230 250 M 100 200 L 100 210 L 220 210 L 220 200"
          />
          <path className={'sketch-fill ' + (checked[0] ? 'on' : '')} d="M104 212 L 216 212 L 216 248 L 104 248 Z" opacity="0.18" />
        </g>

        <g>
          <path
            className={'sketch-layer ' + (checked[1] ? 'on' : '')}
            strokeWidth="2.4"
            d="M60 250 L 60 170 L 100 130 L 130 130 L 116 158 L 90 170"
          />
          <path className={'sketch-fill ' + (checked[1] ? 'on' : '')} d="M100 132 L 130 132 L 116 158 L 89 168 Z" opacity="0.5" />
          <path
            className={'sketch-layer ' + (checked[1] ? 'on' : '')}
            strokeWidth="1.6"
            d="M115 168 L 105 180 M 122 172 L 116 188 M 130 170 L 130 188 M 138 168 L 144 184"
          />
        </g>

        <g>
          <path
            className={'sketch-layer ' + (checked[2] ? 'on' : '')}
            strokeWidth="2.4"
            d="M44 248 L 44 222 C 44 216, 78 216, 78 222 L 78 248 Z M 78 226 C 88 226, 88 240, 78 240"
          />
          <path
            className={'sketch-layer ' + (checked[2] ? 'on' : '')}
            strokeWidth="1.6"
            d="M50 210 C 54 200, 50 196, 54 188 M 60 210 C 64 200, 60 196, 64 188 M 70 210 C 74 200, 70 196, 74 188"
          />
        </g>

        <g>
          <path className={'sketch-layer ' + (checked[3] ? 'on' : '')} strokeWidth="2.4" d="M242 250 L 246 220 L 270 220 L 274 250 Z" />
          <path
            className={'sketch-layer ' + (checked[3] ? 'on' : '')}
            strokeWidth="1.8"
            d="M258 220 L 258 180 M 258 200 C 250 196, 244 188, 248 178 M 258 200 C 266 196, 272 188, 268 178 M 258 188 C 252 184, 250 178, 254 172 M 258 188 C 264 184, 266 178, 262 172"
          />
        </g>

        {checked.every(Boolean) && (
          <g>
            <path
              d="M150 80 C 130 70, 110 90, 130 110 L 200 110 L 216 124 L 210 110 L 230 110 C 248 100, 240 76, 222 78 Z"
              stroke="#C46B47"
              strokeWidth="2.4"
              fill="rgba(196,107,71,0.10)"
            />
            <text x="138" y="100" fontFamily="Caveat" fontSize="22" fill="#C46B47">
              let's build it!
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

function ContactIcon({ kind }) {
  if (kind === 'mail') {
    return (
      <svg className="contact-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 7 L 12 14 L 20.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'upwork') {
    return (
      <svg className="contact-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 6 V 13 a4 4 0 0 0 8 0 V 6 M 13 11 c 2 4 4 4 5 1 a 2.5 2.5 0 1 0 -4.6 -1.3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  if (kind === 'freelance') {
    return (
      <svg className="contact-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="8" width="17" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8 V 6.5 a1 1 0 0 1 1 -1 h 4 a1 1 0 0 1 1 1 V 8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 13 H 20.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="10.5" y="12" width="3" height="2.4" rx="0.5" fill="currentColor" />
      </svg>
    );
  }
  if (kind === 'whatsapp') {
    // Generic chat-bubble glyph so we don't dance on WhatsApp's trademarked logo.
    return (
      <svg className="contact-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3 C 6.8 3, 3 6.6, 3 11 c 0 2 0.8 3.8 2.2 5.2 L 4 21 L 9 19.6 C 9.9 20 11 20.2 12 20.2 c 5.2 0 9 -3.6 9 -8.2 C 21 6.6 17.2 3 12 3 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8.5 11.5 h 7 M 8.5 14 h 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'github') {
    return (
      <svg className="contact-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3.5 C 7 3.5, 3.5 7, 3.5 12 c 0 3.8 2.4 7 5.7 8.2 c 0.4 0.1 0.6 -0.2 0.6 -0.4 v -1.5 c -2.4 0.5 -2.9 -1.1 -2.9 -1.1 c -0.4 -1 -1 -1.3 -1 -1.3 c -0.8 -0.5 0.06 -0.5 0.06 -0.5 c 0.9 0.06 1.4 0.95 1.4 0.95 c 0.8 1.4 2.2 1 2.7 0.75 c 0.08 -0.6 0.32 -1 0.6 -1.2 c -1.9 -0.2 -3.9 -1 -3.9 -4.3 c 0 -1 0.35 -1.7 0.95 -2.3 c -0.1 -0.25 -0.4 -1.2 0.1 -2.5 c 0 0 0.8 -0.25 2.55 0.9 a 8.8 8.8 0 0 1 4.6 0 c 1.75 -1.15 2.55 -0.9 2.55 -0.9 c 0.5 1.3 0.2 2.25 0.1 2.5 c 0.6 0.6 0.95 1.3 0.95 2.3 c 0 3.3 -2 4.1 -3.9 4.3 c 0.35 0.3 0.65 0.85 0.65 1.7 v 2.5 c 0 0.2 0.2 0.55 0.65 0.4 C 18.1 19 20.5 15.8 20.5 12 C 20.5 7 17 3.5 12 3.5 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return null;
}

export default function CTA({ cta }) {
  const [checked, setChecked] = useState(new Array(cta.checklist.length).fill(false));
  const [contactOpen, setContactOpen] = useState(false);
  const toggle = (i) => setChecked((c) => c.map((v, j) => (j === i ? !v : v)));
  const mailContact = cta.contacts.find((c) => c.kind === 'mail');

  return (
    <section className="cta" id="connect">
      <span className="section-mark">{cta.mark}</span>
      <SectionHeading heading={cta.heading} accent={cta.headingAccent} />
      <div className="cta-card">
        <div>
          <p style={{ marginTop: 0, color: 'var(--ink-soft)' }}>{cta.intro}</p>
          <ul className="checklist">
            {cta.checklist.map((label, i) => (
              <li key={i} className={'check-item ' + (checked[i] ? 'checked' : '')} onClick={() => toggle(i)}>
                <span className="box" aria-hidden="true">
                  <svg viewBox="0 0 30 30" fill="none">
                    <path d="M5 16 L 13 23 L 26 7" stroke="#C46B47" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="strike">{label}</span>
              </li>
            ))}
          </ul>
          <div className="cta-actions">
            <button className="cta-btn" type="button" onClick={() => setContactOpen(true)}>
              {cta.buttonLabel} <span className="arr">→</span>
            </button>
          </div>
          <div className="cta-links">
            {cta.contactsLead && <span className="cta-or">{cta.contactsLead}</span>}
            {cta.contacts.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-pill"
              >
                <ContactIcon kind={c.kind} />
                <span>{c.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="sketch-frame">
          <FillingSketch checked={checked} />
          <span style={{ position: 'absolute', bottom: 18, right: 22, fontFamily: 'Caveat, cursive', fontSize: 18, color: 'var(--ink-mute)' }}>
            {checked.filter(Boolean).length}/{cta.checklist.length} boxes checked
          </span>
        </div>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        mailto={mailContact?.href}
        mailtoLabel={mailContact?.label}
      />
    </section>
  );
}
