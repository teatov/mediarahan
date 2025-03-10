import type { Provider } from '$lib';
import type { RequestEvent } from '@sveltejs/kit';
import { generateState } from 'arctic';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import db from '$lib/server/db';
import * as auth from '$lib/server/auth';
import { generateUserId } from '$lib/server/auth';
import { error, redirect } from '@sveltejs/kit';

import twitch from '$lib/server/providers/twitch';

export function handleAuthRedirect(provider: Provider, event: RequestEvent): Response {
  if (event.locals.user) {
    return redirect(302, '/');
  }

  const state = generateState();
  const url = provider.setOauthCookie(state, event);

  return redirect(302, url);
}

export async function handleAuthCallback(
  provider: Provider,
  event: RequestEvent
): Promise<Response> {
  if (event.locals.user) {
    return redirect(302, '/');
  }

  const tokens = await provider.validateOauthToken(event);

  if (!tokens) {
    return error(400, 'Сервис, через который вы пытаетесь войти, вернул неправильные данные');
  }

  const { externalUserId, username, avatarUrl } = await provider.requestUserInfo(tokens);

  const existingExternalAccount = await db.query.externalAccount.findFirst({
    where: and(
      eq(table.externalAccount.provider, provider.name),
      eq(table.externalAccount.externalUserId, externalUserId)
    ),
  });

  if (existingExternalAccount) {
    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingExternalAccount.userId);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return redirect(302, '/');
  }

  try {
    const userId = generateUserId();

    await db.transaction(async (tx) => {
      await db.insert(table.user).values({ id: userId, username, avatarUrl });
      await tx.insert(table.externalAccount).values({
        userId,
        provider: provider.name,
        externalUserId,
        externalUsername: username,
      });
    });

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, userId);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } catch (e) {
    console.error(e);
    return error(500, 'При сохранении нового пользователя возникла ошибка');
  }

  return redirect(302, '/profile');
}

export const providers: Record<string, Provider> = { twitch };
