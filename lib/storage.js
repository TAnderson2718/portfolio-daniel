// Read/write content.json. Local file in dev; GitHub commit when GITHUB_TOKEN is set.
//
// Production note: Vercel functions have an ephemeral filesystem, so the local
// path only works during `next dev`. In prod, the GitHub branch must be set —
// the save endpoint will refuse to write locally.

import fs from 'fs/promises';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'content.json');

export async function readContent() {
  const raw = await fs.readFile(CONTENT_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function writeContent(next, { message } = {}) {
  const useGitHub = process.env.GITHUB_TOKEN && process.env.GITHUB_REPO;
  if (useGitHub) {
    return commitToGitHub(next, message || 'admin: update content');
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Cannot write locally in production. Set GITHUB_TOKEN and GITHUB_REPO to enable GitHub commits.'
    );
  }
  await fs.writeFile(CONTENT_PATH, JSON.stringify(next, null, 2) + '\n', 'utf8');
  return { mode: 'local' };
}

// GitHub Contents API. fetch-based, no Octokit dependency.
async function commitToGitHub(next, message) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const filePath = 'content.json';

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // 1. Get current file SHA (needed by GitHub PUT to detect conflicts).
  const getRes = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`,
    { headers }
  );
  if (!getRes.ok && getRes.status !== 404) {
    const text = await getRes.text();
    throw new Error(`GitHub GET failed (${getRes.status}): ${text}`);
  }
  const existing = getRes.status === 404 ? null : await getRes.json();

  // 2. PUT the new file. Base64-encode the JSON body.
  const body = {
    message,
    content: Buffer.from(JSON.stringify(next, null, 2) + '\n', 'utf8').toString('base64'),
    branch,
  };
  if (existing?.sha) body.sha = existing.sha;

  const putRes = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!putRes.ok) {
    const text = await putRes.text();
    throw new Error(`GitHub PUT failed (${putRes.status}): ${text}`);
  }
  const result = await putRes.json();
  return { mode: 'github', commit: result.commit?.sha };
}
