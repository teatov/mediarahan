import type { RequestEvent } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { authProviders, type ProviderName } from '$lib';
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

  if (event.locals.session) {
    const existingExternalAccount = await db.query.externalAccount.findFirst({
      where: and(
        eq(table.externalAccount.provider, providerName as ProviderName),
        eq(table.externalAccount.userId, event.locals.session.userId)
      ),
    });

    if (existingExternalAccount) {
      return error(400, 'Этот сервис уже привязан');
    }
  } else if (!authProviders.includes(providerName as ProviderName)) {
    return error(400, 'Этот сервис не предназначен для авторизации');
  }

  const provider = providers[providerName];

  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');
  const storedState = provider.stateCookie
    ? (event.cookies.get(provider.stateCookie) ?? undefined)
    : undefined;
  const codeVerifier = provider.verifierCookie
    ? (event.cookies.get(provider.verifierCookie) ?? undefined)
    : undefined;

  if (
    !code ||
    (provider.stateCookie && (!state || !storedState || state !== storedState)) ||
    (provider.verifierCookie && !codeVerifier)
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

  if (event.locals.session && existingExternalAccount) {
    return error(400, 'К этому сервису уже привязан кто-то другой');
  }

  if (event.locals.session && !existingExternalAccount) {
    await db.insert(table.externalAccount).values({
      userId: event.locals.session.userId,
      provider: provider.name,
      externalUserId,
      externalUsername: username,
    });
    return redirect(302, '/profile');
  }

  if (!event.locals.session && existingExternalAccount) {
    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingExternalAccount.userId);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return redirect(302, '/');
  }

  if (!event.locals.session && !existingExternalAccount) {
    try {
      const userId = generateUserId();

      await db.transaction(async (tx) => {
        await tx.insert(table.user).values({ id: userId, username, avatarUrl });
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
      return redirect(302, '/profile');
    } catch (e) {
      console.error(e);
      return error(500, 'При сохранении нового пользователя возникла ошибка');
    }
  }

  return error(500, 'Этого не может быть...');
}
