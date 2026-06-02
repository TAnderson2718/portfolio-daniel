'use client';

// Compact storage usage panel for the admin sidebar.
// Polls /api/cloudinary-usage on mount and after orphan cleanups (via a refresh-event hook).

import { useState, useEffect, useCallback } from 'react';

function pct(n) {
  if (n == null || isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n * 10) / 10));
}

function fmtBytes(n) {
  if (!n) return '0';
  const g = n / (1024 * 1024 * 1024);
  if (g >= 1) return `${g.toFixed(2)} GB`;
  const m = n / (1024 * 1024);
  if (m >= 1) return `${m.toFixed(1)} MB`;
  return `${(n / 1024).toFixed(0)} KB`;
}

function Bar({ label, used, limit, usedPercent, format = 'count' }) {
  const p = pct(usedPercent);
  const tone = p > 80 ? 'danger' : p > 50 ? 'warn' : 'ok';
  const usedFmt = format === 'bytes' ? fmtBytes(used) : String(used ?? '—');
  const limitFmt = format === 'bytes' ? fmtBytes(limit) : String(limit ?? '—');
  return (
    <div className="usage-bar">
      <div className="usage-bar-head">
        <span>{label}</span>
        <span className="usage-bar-num">
          {usedFmt} <span style={{ opacity: 0.5 }}>/ {limitFmt}</span>
        </span>
      </div>
      <div className="usage-track">
        <div className={`usage-fill ${tone}`} style={{ width: p + '%' }} />
      </div>
    </div>
  );
}

export default function StorageWidget({ refreshKey }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/cloudinary-usage');
      if (res.ok) {
        const d = await res.json();
        setData({ ...d, source: 'api' });
        return;
      }
      // Fallback: derive storage usage from listing the portfolio/ folder.
      // Doesn't give bandwidth or credits, but storage is what matters for quota.
      const fallback = await fetch('/api/cloudinary-orphans');
      if (!fallback.ok) {
        const e = await fallback.json().catch(() => ({}));
        throw new Error(e.error || `usage ${res.status}`);
      }
      const o = await fallback.json();
      // Free-tier storage limit is 25 GB. Hardcoded because /usage is what would tell us;
      // if you're on a higher plan and /usage is forbidden, this number understates % used.
      const FREE_LIMIT_BYTES = 25 * 1024 * 1024 * 1024;
      setData({
        storage: {
          usage: o.totalBytes,
          limit: FREE_LIMIT_BYTES,
          used_percent: (o.totalBytes / FREE_LIMIT_BYTES) * 100,
        },
        portfolioBreakdown: { inUseBytes: o.inUseBytes, orphanBytes: o.orphanBytes },
        source: 'fallback',
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (loading && !data) {
    return <div className="usage-panel"><div className="usage-title">Storage</div><div className="usage-loading">Loading…</div></div>;
  }
  if (err) {
    const isPermErr = /permission|forbidden|403/i.test(err);
    return (
      <div className="usage-panel">
        <div className="usage-title">Storage</div>
        <div className="usage-err">
          {isPermErr ? (
            <>API key role too restrictive — needs <strong>Admin</strong> for live usage. Storage tab still works.</>
          ) : (
            err
          )}
        </div>
      </div>
    );
  }
  if (!data) return null;

  const isFallback = data.source === 'fallback';
  return (
    <div className="usage-panel">
      <div className="usage-title">
        Storage
        <button type="button" className="usage-refresh" onClick={load} title="Refresh">↻</button>
      </div>
      <Bar label="Storage" used={data.storage?.usage} limit={data.storage?.limit} usedPercent={data.storage?.used_percent} format="bytes" />
      {!isFallback && (
        <>
          <Bar label="Bandwidth" used={data.bandwidth?.usage} limit={data.bandwidth?.limit} usedPercent={data.bandwidth?.used_percent} format="bytes" />
          <Bar label="Credits" used={data.credits?.usage} limit={data.credits?.limit} usedPercent={data.credits?.used_percent} />
        </>
      )}
      {isFallback && (
        <div className="usage-note">
          Computed from portfolio/ folder · /usage perm forbidden
        </div>
      )}
    </div>
  );
}
