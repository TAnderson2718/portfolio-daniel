'use client';

import { useEffect, useState } from 'react';

// Super-admin only: manage admin accounts.
export default function UsersPanel({ me }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const r = await fetch('/api/users');
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed to load users.');
      setUsers(d.users || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function createUser(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const r = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Create failed.');
      setForm({ username: '', password: '', role: 'admin' });
      load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeUser(username) {
    if (!window.confirm(`Delete admin "${username}"? This can't be undone.`)) return;
    setErr('');
    const r = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const d = await r.json();
    if (!r.ok) return setErr(d.error || 'Delete failed.');
    load();
  }

  async function resetPw(username) {
    const password = window.prompt(`New password for "${username}" (min 8 characters):`);
    if (!password) return;
    setErr('');
    const r = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const d = await r.json();
    if (!r.ok) return setErr(d.error || 'Reset failed.');
    window.alert(`Password updated for ${username}.`);
  }

  return (
    <div className="admin-users">
      {err && <div className="admin-err">{err}</div>}

      <form className="admin-card" onSubmit={createUser}>
        <h3>Add an admin</h3>
        <div className="admin-field">
          <label>Username</label>
          <input
            className="admin-input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="lowercase · 3–32 · letters/numbers/._-"
            autoComplete="off"
          />
        </div>
        <div className="admin-field">
          <label>Password</label>
          <input
            className="admin-input"
            type="text"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="min 8 characters"
            autoComplete="new-password"
          />
        </div>
        <div className="admin-field">
          <label>Role</label>
          <select
            className="admin-input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">admin — edit content + images only</option>
            <option value="super">super — full access + user mgmt + logs</option>
          </select>
        </div>
        <button className="admin-btn primary" disabled={busy}>
          {busy ? 'Adding…' : 'Add admin'}
        </button>
      </form>

      <h3 style={{ marginTop: 24 }}>Admins</h3>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.username}>
                <td>
                  {u.username}
                  {u.username === me?.username && <span className="admin-you"> (you)</span>}
                </td>
                <td>{u.role}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button type="button" className="admin-btn small" onClick={() => resetPw(u.username)}>
                    Reset PW
                  </button>
                  {u.username !== me?.username && (
                    <button type="button" className="admin-btn small danger" onClick={() => removeUser(u.username)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
