'use client';

// ImageUpload — click/drop to upload to Cloudinary (unsigned preset), or paste a URL.
// On replace (uploading over an existing Cloudinary image), the old one is auto-deleted
// to protect free-tier quota. "Remove" only clears locally; "Delete" hits Cloudinary destroy.

import { useRef, useState } from 'react';

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAX_DIM = 2400; // px — anything bigger gets downsampled client-side
const RESIZABLE = /^image\/(jpeg|png|webp)$/;

const isCloudinaryUrl = (u) =>
  typeof u === 'string' && /^https:\/\/res\.cloudinary\.com\//.test(u);

// Downscale very large raster images in the browser before upload. Saves quota
// dramatically — a 12 MB phone screenshot becomes ~400 KB. SVG/GIF are passed
// through (vector / animation would be destroyed by canvas conversion).
async function maybeResize(file) {
  if (!RESIZABLE.test(file.type)) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const { width, height } = bitmap;
  if (width <= MAX_DIM && height <= MAX_DIM) {
    bitmap.close?.();
    return file;
  }
  const scale = MAX_DIM / Math.max(width, height);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, file.type, 0.92));
  if (!blob) return file;
  return new File([blob], file.name, { type: file.type });
}

async function uploadToCloudinary(file) {
  if (!CLOUD || !PRESET) {
    throw new Error('Cloudinary env vars missing (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / _UPLOAD_PRESET)');
  }
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `upload failed (${res.status})`);
  return data.secure_url;
}

async function destroyOnCloudinary(url) {
  const res = await fetch('/api/delete-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `delete failed (${res.status})`);
  return data;
}

export default function ImageUpload({ value, onChange, hint }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState('');
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    setErr('');
    setInfo('');
    setBusy(true);
    const oldUrl = value;
    try {
      const originalSize = file.size;
      setBusyLabel('Optimizing…');
      const prepared = await maybeResize(file);
      const shrunk = prepared !== file;
      setBusyLabel(shrunk ? 'Uploading (resized)…' : 'Uploading…');
      const url = await uploadToCloudinary(prepared);
      onChange(url);
      const notes = [];
      if (shrunk) {
        const savedKB = Math.round((originalSize - prepared.size) / 1024);
        notes.push(`Resized to ≤${MAX_DIM}px (saved ~${savedKB} KB).`);
      }
      // Quota protection: if we just replaced a Cloudinary image, destroy the old one.
      if (isCloudinaryUrl(oldUrl) && oldUrl !== url) {
        setBusyLabel('Cleaning up old image…');
        try {
          await destroyOnCloudinary(oldUrl);
          notes.push('Old image deleted from Cloudinary.');
        } catch (e) {
          notes.push(`Could not auto-delete old image: ${e.message}`);
        }
      }
      if (notes.length) setInfo(notes.join(' '));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
      setBusyLabel('');
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function removeLocal() {
    // Local-only — old image stays in Cloudinary, recoverable via paste.
    onChange('');
    setErr('');
    setInfo('');
  }

  async function destroyAndClear() {
    if (!isCloudinaryUrl(value)) {
      removeLocal();
      return;
    }
    if (!confirm('Permanently delete this image from Cloudinary? This frees storage but cannot be undone.')) {
      return;
    }
    setErr('');
    setInfo('');
    setBusyLabel('Deleting from Cloudinary…');
    setBusy(true);
    try {
      await destroyOnCloudinary(value);
      onChange('');
      setInfo('Deleted from Cloudinary.');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
      setBusyLabel('');
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const hasImage = !!value;
  const cldImage = isCloudinaryUrl(value);

  return (
    <div className="img-upload">
      <div
        className={'img-upload-drop ' + (dragOver ? 'over' : '') + (hasImage ? ' has-image' : '')}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !busy && fileRef.current?.click()}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="upload preview" />
        ) : (
          <div className="img-upload-empty">
            {busy ? busyLabel : (
              <>
                <div className="img-upload-icon">↑</div>
                <div>Click or drop an image</div>
              </>
            )}
          </div>
        )}
        {busy && hasImage && <div className="img-upload-busy">{busyLabel}</div>}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <div className="img-upload-row">
        <input
          className="admin-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL"
        />
        {hasImage && (
          <button
            type="button"
            className="admin-btn"
            onClick={removeLocal}
            disabled={busy}
            title="Clear this field (image stays in Cloudinary)"
          >
            Remove
          </button>
        )}
        {cldImage && (
          <button
            type="button"
            className="admin-btn danger"
            onClick={destroyAndClear}
            disabled={busy}
            title="Permanently delete from Cloudinary (frees free-tier quota)"
          >
            Delete
          </button>
        )}
      </div>

      {hint && <div className="img-upload-hint">{hint}</div>}
      {info && <div className="img-upload-info">{info}</div>}
      {err && <div className="img-upload-err">{err}</div>}
    </div>
  );
}
