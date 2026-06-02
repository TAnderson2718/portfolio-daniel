'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get('from') || '/admin';

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        setErr(error || 'login failed');
        return;
      }
      router.replace(from);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <h1>Admin</h1>
        <p>Single-user content editor.</p>
        <div className="admin-field">
          <label htmlFor="pw">Password</label>
          <input
            id="pw"
            className="admin-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
        </div>
        {err && <div className="admin-err">{err}</div>}
        <button className="admin-btn primary" type="submit" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="admin-login" />}>
      <LoginForm />
    </Suspense>
  );
}
