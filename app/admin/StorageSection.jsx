'use client';

// "Storage" section in the admin. Shows usage detail + orphan cleanup UI.

import { useState, useEffect, useCallback } from 'react';

function fmtBytes(n) {
  if (!n) return '0';
  const g = n / (1024 * 1024 * 1024);
  if (g >= 1) return `${g.toFixed(2)} GB`;
  const m = n / (1024 * 1024);
  if (m >= 1) return `${m.toFixed(1)} MB`;
  return `${(n / 1024).toFixed(0)} KB`;
}

export default function StorageSection({ onCleanup }) {
  const [orphans, setOrphans] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const load = useCallback(async () => {
    setStatus({ type: '', msg: '' });
    try {
      const res = await fetch('/api/cloudinary-orphans');
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `orphans ${res.status}`);
      }
      const data = await res.json();
      setOrphans(data);
      setSelected(new Set());
    } catch (e) {
      setStatus({ type: 'err', msg: e.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = (pid) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(pid)) next.delete(pid);
      else next.add(pid);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(orphans.orphans.map((o) => o.publicId)));
  const clearAll = () => setSelected(new Set());

  async function deleteSelected() {
    if (!selected.size) return;
    if (!confirm(`Permanently delete ${selected.size} unused image(s) from Cloudinary? This cannot be undone.`)) return;
    setBusy(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await fetch('/api/cloudinary-delete-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `delete-batch ${res.status}`);
      setStatus({ type: 'ok', msg: `Deleted ${data.deleted} image(s).` });
      await load();
      onCleanup?.();
    } catch (e) {
      setStatus({ type: 'err', msg: e.message });
    } finally {
      setBusy(false);
    }
  }

  if (!orphans) {
    return <div>Loading orphans…</div>;
  }

  const o = orphans;
  return (
    <div className="storage-section">
      <div className="storage-stats">
        <div className="storage-stat">
          <div className="storage-stat-num">{o.totalAssets}</div>
          <div className="storage-stat-lbl">Total in <code>{o.folder}/</code></div>
        </div>
        <div className="storage-stat">
          <div className="storage-stat-num">{o.inUseCount}</div>
          <div className="storage-stat-lbl">Used by content.json</div>
        </div>
        <div className={'storage-stat ' + (o.orphanCount > 0 ? 'storage-stat-alert' : '')}>
          <div className="storage-stat-num">{o.orphanCount}</div>
          <div className="storage-stat-lbl">Orphaned ({fmtBytes(o.orphanBytes)})</div>
        </div>
      </div>

      <div className="storage-toolbar">
        <button type="button" className="admin-btn" onClick={load} disabled={busy}>Refresh</button>
        <button type="button" className="admin-btn" onClick={selectAll} disabled={busy || !o.orphanCount}>Select all orphans</button>
        <button type="button" className="admin-btn" onClick={clearAll} disabled={busy || !selected.size}>Clear selection</button>
        <button
          type="button"
          className="admin-btn danger"
          onClick={deleteSelected}
          disabled={busy || !selected.size}
        >
          {busy ? 'Deleting…' : `Delete ${selected.size} selected`}
        </button>
        {status.msg && <span className={`status ${status.type}`} style={{ marginLeft: 12, fontSize: 13 }}>{status.msg}</span>}
      </div>

      <h3 className="storage-sub">Orphans <span className="hint">— uploaded but not referenced in content.json</span></h3>
      {o.orphans.length === 0 ? (
        <div className="storage-empty">Nothing to clean up — every uploaded image is referenced. ✓</div>
      ) : (
        <div className="storage-grid">
          {o.orphans.map((a) => {
            const sel = selected.has(a.publicId);
            return (
              <label key={a.publicId} className={'storage-card ' + (sel ? 'selected' : '')}>
                <input
                  type="checkbox"
                  checked={sel}
                  onChange={() => toggle(a.publicId)}
                  disabled={busy}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.secureUrl} alt={a.publicId} />
                <div className="storage-card-meta">
                  <div className="storage-card-id" title={a.publicId}>{a.publicId}</div>
                  <div className="storage-card-sub">{a.width}×{a.height} · {fmtBytes(a.bytes)} · {a.format}</div>
                  <div className="storage-card-date">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {o.inUse.length > 0 && (
        <details className="storage-inuse">
          <summary>{o.inUse.length} images in use (read-only)</summary>
          <div className="storage-grid">
            {o.inUse.map((a) => (
              <div key={a.publicId} className="storage-card inuse">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.secureUrl} alt={a.publicId} />
                <div className="storage-card-meta">
                  <div className="storage-card-id" title={a.publicId}>{a.publicId}</div>
                  <div className="storage-card-sub">{a.width}×{a.height} · {fmtBytes(a.bytes)}</div>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
