import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase, encodeBase32LowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const SESSION_COOKIE_NAME = 'auth-session';

export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  const token = encodeBase64url(bytes);
  return token;
}

export async function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: table.Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
  };
  await db.insert(table.session).values(session);
  return session;
}

export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db.query.session.findFirst({
    where: eq(table.session.id, sessionId),
    with: {
      user: {
        with: {
          externalAccounts: true,
          currentWheel: true,
        },
      },
    },
  });

  if (!result) {
    return { user: null, session: null };
  }

  const { user, ...session } = result;

  const sessionExpired = Date.now() >= session.expiresAt.getTime();
  if (sessionExpired) {
    await db.delete(table.session).where(eq(table.session.id, session.id));
    return { user: null, session: null };
  }

  const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
  if (renewSession) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
    await db
      .update(table.session)
      .set({ expiresAt: session.expiresAt })
      .where(eq(table.session.id, session.id));
  }

  return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
  await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  event.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    expires: expiresAt,
    path: '/',
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  event.cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
  });
}

export function generateUserId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

// const SECRET_KEY = crypto.randomBytes(32).toString("hex").slice(0, 32);
// const SECRET_IV = crypto.randomBytes(16).toString("hex").slice(0, 16);

export function encryptToken(val: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', env.SECRET_KEY, env.SECRET_IV);
  const encrypted = cipher.update(val, 'utf8', 'base64');
  return encrypted + cipher.final('base64');
}

export function decryptToken(encrypted: string) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', env.SECRET_KEY, env.SECRET_IV);
  const decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
}
