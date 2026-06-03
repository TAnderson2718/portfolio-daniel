// Admin users stored in Redis. Passwords are bcrypt-hashed (never plaintext).
// Key scheme:
//   user:<username>  -> hash { username, role, passwordHash, createdAt }
//   users            -> set of usernames
// Roles: 'super' (full access + user mgmt + audit log) | 'admin' (content + images only)
import bcrypt from 'bcryptjs';
import { getRedis } from './db';

export const ROLES = ['super', 'admin'];
const USERS_SET = 'users';
const userKey = (u) => `user:${u}`;

export function normalizeUsername(u) {
  return String(u || '').trim().toLowerCase();
}

export async function getUser(username) {
  const u = normalizeUsername(username);
  if (!u) return null;
  const data = await getRedis().hgetall(userKey(u));
  return data && data.username ? data : null;
}

export async function listUsers() {
  const redis = getRedis();
  const names = await redis.smembers(USERS_SET);
  const users = await Promise.all(names.map((n) => getUser(n)));
  // never leak password hashes
  return users
    .filter(Boolean)
    .map(({ passwordHash, ...rest }) => rest)
    .sort((a, b) => (a.username < b.username ? -1 : 1));
}

export async function countUsers() {
  return await getRedis().scard(USERS_SET);
}

export async function createUser({ username, password, role }) {
  const u = normalizeUsername(username);
  if (!/^[a-z0-9._-]{3,32}$/.test(u)) {
    throw new Error('Username must be 3–32 chars: lowercase letters, numbers, . _ -');
  }
  if (!password || String(password).length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
  if (!ROLES.includes(role)) throw new Error('Invalid role.');
  const redis = getRedis();
  if (await redis.sismember(USERS_SET, u)) throw new Error('That username already exists.');
  const passwordHash = await bcrypt.hash(String(password), 10);
  const record = { username: u, role, passwordHash, createdAt: new Date().toISOString() };
  await redis.hset(userKey(u), record);
  await redis.sadd(USERS_SET, u);
  return { username: u, role, createdAt: record.createdAt };
}

export async function deleteUser(username) {
  const u = normalizeUsername(username);
  const redis = getRedis();
  await redis.del(userKey(u));
  await redis.srem(USERS_SET, u);
}

export async function setPassword(username, password) {
  if (!password || String(password).length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
  const user = await getUser(username);
  if (!user) throw new Error('No such user.');
  const passwordHash = await bcrypt.hash(String(password), 10);
  await getRedis().hset(userKey(user.username), { passwordHash });
}

// Returns { username, role } on success, or null on bad credentials.
export async function verifyUser(username, password) {
  const user = await getUser(username);
  if (!user) return null;
  const ok = await bcrypt.compare(String(password || ''), user.passwordHash || '');
  return ok ? { username: user.username, role: user.role } : null;
}
