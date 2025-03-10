import type { Handle } from '@sveltejs/kit';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { env } from '$env/dynamic/private';
import * as auth from '$lib/server/auth.js';
import db from '$lib/server/db';

if (env.NODE_ENV === 'production') {
  console.log('Запускаем миграции БД...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Миграции готовы!');
}

const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(auth.sessionCookieName);
  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await auth.validateSessionToken(sessionToken);
  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    auth.deleteSessionTokenCookie(event);
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};

export const handle: Handle = handleAuth;
