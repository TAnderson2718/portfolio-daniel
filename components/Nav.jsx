'use client';

import { ScribbleUnderline } from './Scrapbook';

// Handle in-page anchor nav ourselves: prevent the browser's native hash jump
// (which can race with smooth scroll and snap back to the top), scroll manually,
// then update the URL hash without triggering another jump.
function scrollToHash(e, href) {
  if (!href || !href.startsWith('#')) return;
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  window.history.pushState(null, '', href);
}

export default function Nav({ brand, links }) {
  return (
    <nav className="nav" aria-label="Primary">
      <a className="nav-mark" href="#top" aria-label="home" onClick={(e) => scrollToHash(e, '#top')}>
        <span className="term-prompt" aria-hidden="true">&gt;</span>
        <span className="term-path">{brand}</span>
        <span className="term-caret" aria-hidden="true"></span>
      </a>
      <div className="nav-links">
        {links.map((l, i) => (
          <a key={i} className="nav-link" href={l.href} onClick={(e) => scrollToHash(e, l.href)}>
            {l.label}
            <ScribbleUnderline />
          </a>
        ))}
      </div>
    </nav>
  );
}
