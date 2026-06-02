// Recursively walk a JSON value and collect all Cloudinary delivery URLs.
// Used to figure out which uploads are still referenced in content.json so
// we can identify orphans for cleanup.

const CLD_PREFIX = 'https://res.cloudinary.com/';

export function collectCloudinaryUrls(value, out = new Set()) {
  if (value == null) return out;
  if (typeof value === 'string') {
    if (value.startsWith(CLD_PREFIX)) out.add(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectCloudinaryUrls(v, out);
    return out;
  }
  if (typeof value === 'object') {
    for (const v of Object.values(value)) collectCloudinaryUrls(v, out);
    return out;
  }
  return out;
}

// Same logic as /api/delete-image — kept duplicated to avoid a circular import.
export function publicIdFromUrl(url) {
  if (typeof url !== 'string') return null;
  const clean = url.split('?')[0].split('#')[0];
  const m = clean.match(/\/upload\/(?:[^/]+\/)?v\d+\/(.+)\.[^./]+$/);
  return m ? m[1] : null;
}
