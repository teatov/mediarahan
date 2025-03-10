import type { RequestEvent } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { generateUserId } from '$lib/server/auth';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import providers from '$lib/server/providers';

export async function GET(event: RequestEvent): Promise<Response> {
  const providerName = event.params.provider;

  if (!providerName || !Object.keys(providers).includes(providerName)) {
    return error(404, 'Такого сервиса не существует');
  }

  if (event.locals.user) {
    return redirect(302, '/');
  }

  const provider = providers[providerName];

  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');
  const storedState = event.cookies.get(provider.stateCookie) ?? undefined;
  const codeVerifier = provider.verifierCookie
    ? (event.cookies.get(provider.verifierCookie) ?? undefined)
    : undefined;

  if (
    !code ||
    !state ||
    !storedState ||
    (provider.verifierCookie && !codeVerifier) ||
    state !== storedState
  ) {
    console.error({ storedState, code, state });
    return error(400, 'Сервис, через который вы пытаетесь войти, вернул неправильные данные');
  }

  const tokens = await provider.validateAuthorizationCode(
    code,
    provider.verifierCookie ? codeVerifier : undefined
  );

  if (!tokens) {
    return error(400, 'Ошибка при валидации токена авторизации');
  }

  const { externalUserId, username, avatarUrl } = await provider.getUserInfo(tokens);

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
