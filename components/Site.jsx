'use client';

import { useEffect } from 'react';
import Nav from './Nav';
import Hero from './Hero';
import Values from './Values';
import Work from './Work';
import Process from './Process';
import Proof from './Proof';
import CTA from './CTA';

export default function Site({ content }) {
  // dev console easter egg — for the kind of visitor who opens the inspector
  useEffect(() => {
    const mail =
      content?.cta?.contacts?.find((c) => c.kind === 'mail')?.label || "let's talk";
    const head = 'color:#C46B47;font:800 20px/1 monospace;';
    const soft = 'color:#5B554A;font:400 13px/1.6 monospace;';
    const link = 'color:#A4502F;font:600 13px/1.6 monospace;';
    console.log('%c> oh, hello down here.', head);
    console.log("%cyou opened the console — we're basically friends now.", soft);
    console.log(`%csay hi sometime → ${mail}`, link);
  }, [content]);

  // subtle scroll-reveal for below-the-fold sections (skips on reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll('.shell > section')).filter(
      (el) => !el.classList.contains('hero')
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal--in');
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.04 }
    );

    els.forEach((el) => {
      // already in view at load → show immediately, no animation
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
        el.classList.add('reveal--in');
      } else {
        el.classList.add('reveal');
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="shell">
      <Nav brand={content.nav.brand} links={content.nav.links} />
      <Hero hero={content.hero} skills={content.skills} />
      <Work work={content.work} />
      <Values values={content.values} />
      <Process process={content.process} />
      <Proof proof={content.proof} />
      <CTA cta={content.cta} />
      <footer className="foot">
        <span className="sig">{content.footer.sig}</span>
        {content.footer.copyright}
      </footer>
    </div>
  );
}
