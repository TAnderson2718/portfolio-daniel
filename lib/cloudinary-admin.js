// Cloudinary Admin API client. Uses HTTP Basic auth (key:secret) — server-only.
// Helpers cover the operations the admin UI needs: usage, list-by-folder, batch destroy.

const ADMIN_BASE = 'https://api.cloudinary.com/v1_1';

function creds() {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    throw new Error('Cloudinary env missing (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET)');
  }
  return { cloud, auth: 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64') };
}

async function adminFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const { cloud, auth } = creds();
  const res = await fetch(`${ADMIN_BASE}/${cloud}${path}`, {
    method,
    headers: {
      Authorization: auth,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `Cloudinary Admin API ${res.status}`;
    const e = new Error(msg);
    e.status = res.status;
    e.raw = data;
    throw e;
  }
  return data;
}

// GET /usage — credits, storage, bandwidth, transformation counts, etc.
export async function getUsage() {
  return adminFetch('/usage');
}

// List all image assets in a given asset folder (using the search API).
// Paginated under the hood — we collect up to maxResults total.
export async function listInFolder(folder, { maxResults = 500 } = {}) {
  const all = [];
  let nextCursor;
  do {
    const body = {
      expression: `folder="${folder}"`,
      max_results: 100,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    };
    const res = await adminFetch('/resources/search', { method: 'POST', body });
    all.push(...(res.resources || []));
    nextCursor = res.next_cursor;
    if (all.length >= maxResults) break;
  } while (nextCursor);
  return all;
}

// Batch destroy by public_id list. Cloudinary's "delete resources" endpoint takes up to 100 at a time.
export async function destroyMany(publicIds) {
  if (!publicIds?.length) return { deleted: {}, partial: false };
  const merged = { deleted: {}, deleted_counts: {}, partial: false };
  for (let i = 0; i < publicIds.length; i += 100) {
    const chunk = publicIds.slice(i, i + 100);
    const params = new URLSearchParams();
    chunk.forEach((id) => params.append('public_ids[]', id));
    const { cloud, auth } = creds();
    const res = await fetch(`${ADMIN_BASE}/${cloud}/resources/image/upload?${params.toString()}`, {
      method: 'DELETE',
      headers: { Authorization: auth },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const e = new Error(data?.error?.message || `delete ${res.status}`);
      e.raw = data;
      throw e;
    }
    Object.assign(merged.deleted, data.deleted || {});
    if (data.partial) merged.partial = true;
  }
  return merged;
}
