'use client';

import { useEffect, useState } from 'react';

const LABELS = {
  login: 'Signed in',
  login_failed: 'Failed login',
  logout: 'Signed out',
  content_save: 'Saved content',
  image_delete: 'Deleted image',
  image_delete_batch: 'Batch-deleted images',
  user_create: 'Created admin',
  user_delete: 'Deleted admin',
  user_password_reset: 'Reset password',
  seed_super: 'Created first super-admin',
};

// Super-admin only: read-only activity log.
export default function ActivityPanel() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const r = await fetch('/api/audit?limit=200');
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed to load log.');
      setEntries(d.entries || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="admin-activity">
      <button type="button" className="admin-btn" onClick={load} style={{ marginBottom: 12 }}>
        ↻ Refresh
      </button>
      {err && <div className="admin-err">{err}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : entries.length === 0 ? (
        <p>No activity recorded yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Who</th>
              <th>Action</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i} className={e.action === 'login_failed' ? 'admin-row-warn' : ''}>
                <td style={{ whiteSpace: 'nowrap' }}>{e.ts ? new Date(e.ts).toLocaleString() : '—'}</td>
                <td>{e.actor}</td>
                <td>{LABELS[e.action] || e.action}</td>
                <td className="admin-muted">{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
