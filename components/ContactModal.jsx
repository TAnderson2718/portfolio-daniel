'use client';

import { useState, useEffect, useRef } from 'react';

export default function ContactModal({ open, onClose, mailto, mailtoLabel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [gotcha, setGotcha] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState('');
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open, onClose]);

  const reset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setGotcha('');
    setState('idle');
    setErrMsg('');
  };

  const close = () => {
    onClose();
    // Reset after the close animation finishes so the user doesn't see
    // the form wipe before the modal is gone.
    setTimeout(reset, 220);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    setErrMsg('');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, _gotcha: gotcha }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setState('sent');
      } else {
        setState('error');
        setErrMsg(data.error || 'Something went wrong. Try again, or drop me an email.');
      }
    } catch {
      setState('error');
      setErrMsg('Network hiccup. Try again, or drop me an email.');
    }
  };

  if (!open) return null;

  return (
    <div className="contact-modal-overlay" onClick={close}>
      <div
        className="contact-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button className="contact-modal-close" onClick={close} aria-label="Close">
          ✕
        </button>

        {state === 'sent' ? (
          <div className="contact-modal-success">
            <div className="contact-modal-success-icon" aria-hidden="true">
              ✓
            </div>
            <h3 id="contact-modal-title">Got it.</h3>
            <p>I&apos;ll come back with an honest read within a day. Talk soon.</p>
            <button className="cta-btn" onClick={close} type="button">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h3 id="contact-modal-title">Drop me a paragraph</h3>
            <p className="contact-modal-lede">
              Rough is fine — I&apos;ll come back with an honest read within a day.
            </p>

            <label className="contact-modal-field">
              <span>Your name</span>
              <input
                ref={firstFieldRef}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={state === 'sending'}
              />
            </label>

            <label className="contact-modal-field">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={state === 'sending'}
              />
            </label>

            <label className="contact-modal-field">
              <span>About your project</span>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A paragraph is enough. What are you trying to build?"
                disabled={state === 'sending'}
              />
            </label>

            {/* Honeypot — hidden from humans via off-screen positioning. Bots fill it. */}
            <div className="contact-modal-honeypot" aria-hidden="true">
              <label>
                Don&apos;t fill this
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={gotcha}
                  onChange={(e) => setGotcha(e.target.value)}
                />
              </label>
            </div>

            {errMsg && <div className="contact-modal-error">{errMsg}</div>}

            <div className="contact-modal-actions">
              <button type="submit" className="cta-btn" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send it →'}
              </button>
            </div>

            {mailto && (
              <div className="contact-modal-fallback">
                Prefer email? <a href={mailto}>{mailtoLabel || 'Email me'}</a>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
