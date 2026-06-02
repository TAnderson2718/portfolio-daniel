// Cloudinary URL helpers.
//
// We store the raw secure_url from upload (e.g.
//   https://res.cloudinary.com/<cloud>/image/upload/v1234/portfolio/foo_abc.png
// ) in content.json so it stays valid even if we change delivery options later.
// On render we inject f_auto,q_auto to let Cloudinary serve WebP/AVIF + auto-quality.

const CLD_URL_RE =
  /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video|raw)\/upload)\/(.+)$/;

// Insert (or replace) a transformation segment. If the URL already has a
// transformation block (no "v123" prefix), we prepend; otherwise we add.
export function cldOptimize(url, transform = 'f_auto,q_auto') {
  if (!url) return url;
  const m = url.match(CLD_URL_RE);
  if (!m) return url; // not a Cloudinary URL, leave alone
  const [, base, rest] = m;
  // If the next path segment looks like a version (v1234) or a public id directly,
  // just prepend our transform. If there's already a transform, prepend ours so
  // f_auto/q_auto wins.
  return `${base}/${transform}/${rest}`;
}

// Same but with explicit width — useful for the work-card thumb (small).
export function cldThumb(url, width = 600) {
  return cldOptimize(url, `f_auto,q_auto,w_${width},c_fill`);
}
