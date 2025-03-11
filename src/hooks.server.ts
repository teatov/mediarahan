import type { Handle, ServerInit } from '@sveltejs/kit';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as auth from '$lib/server/auth.js';
import db from '$lib/server/db';

export const init: ServerInit = async () => {
  if (import.meta.env.PROD) {
    console.log('Запускаем миграции БД...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Миграции готовы!');
  }
};

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
