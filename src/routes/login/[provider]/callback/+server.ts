import type { RequestEvent } from '@sveltejs/kit';
import * as arctic from 'arctic';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { authProviders, type ProviderName } from '$lib/providers';
import * as auth from '$lib/server/auth';
import { generateUserId } from '$lib/server/auth';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import providers from '$lib/server/providers';

export async function GET(event: RequestEvent): Promise<Response> {
  const providerName = event.params.provider;

  function errorRedirect(message: string) {
    return redirect(
      event.locals.session ? '/profile' : '/login',
      { type: 'error', message },
      event
    );
  }

  if (!providerName || !Object.keys(providers).includes(providerName)) {
    return errorRedirect('Такого сервиса не существует');
  }

  if (event.locals.session) {
    const existingExternalAccount = await db.query.externalAccount.findFirst({
      where: and(
        eq(table.externalAccount.provider, providerName as ProviderName),
        eq(table.externalAccount.userId, event.locals.session.userId)
      ),
    });

    if (existingExternalAccount) {
      return errorRedirect('Этот сервис уже привязан');
    }
  } else if (!authProviders.includes(providerName as ProviderName)) {
    return errorRedirect('Этот сервис не предназначен для входа');
  }

  const provider = providers[providerName];

  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');
  const storedState = provider.stateCookie
    ? (event.cookies.get(provider.stateCookie) ?? undefined)
    : undefined;
  const storedCodeVerifier = provider.verifierCookie
    ? (event.cookies.get(provider.verifierCookie) ?? undefined)
    : undefined;

  if (
    !code ||
    (provider.stateCookie && (!state || !storedState || state !== storedState)) ||
    (provider.verifierCookie && !storedCodeVerifier)
  ) {
    console.error({ code, state, storedState, storedCodeVerifier });
    return errorRedirect('Сервис, через который вы пытаетесь войти, вернул неправильные данные');
  }

  let tokens: arctic.OAuth2Tokens | null = null;

  try {
    tokens = await provider.validateAuthorizationCode(
      code,
      provider.verifierCookie ? storedCodeVerifier : undefined
    );
  } catch (e) {
    console.error(e);
    if (e instanceof arctic.OAuth2RequestError) {
      return errorRedirect('Невалидный код авторизации, реквизиты или URL перенаправления');
    }
    if (e instanceof arctic.ArcticFetchError) {
      return errorRedirect('Не удалось отправить запрос на валидацию токена');
    }
    if (
      e instanceof arctic.UnexpectedResponseError ||
      e instanceof arctic.UnexpectedErrorResponseBodyError
    ) {
      return errorRedirect('Сервис вернул не те данные которые ожидались');
    }
    return errorRedirect('Ошибка при валидации токена авторизации');
  }

  if (!tokens) {
    return errorRedirect('Токен авторизации оказался невалидным');
  }

  const {
    externalUserId,
    username,
    avatarUrl,
    socketToken,
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
  } = await provider.getUserInfo(tokens);

  const existingExternalAccount = await db.query.externalAccount.findFirst({
    where: and(
      eq(table.externalAccount.provider, provider.name),
      eq(table.externalAccount.externalUserId, externalUserId)
    ),
  });

  if (event.locals.session && existingExternalAccount) {
    return errorRedirect('К этому аккаунту уже привязан кто-то другой');
  }

  const createExternalAccountValues = (userId: string): table.NewExternalAccount => ({
    userId: userId,
    provider: provider.name,
    externalUserId,
    externalUsername: username,
    socketTokenEncrypted: socketToken ? auth.encryptToken(socketToken) : null,
    accessTokenEncrypted: accessToken ? auth.encryptToken(accessToken) : null,
    accessTokenExpiresAt,
    refreshTokenEncrypted: refreshToken ? auth.encryptToken(refreshToken) : null,
    avatarUrl,
  });

  const createSession = async (userId: string) => {
    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, userId);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  };

  if (event.locals.session && !existingExternalAccount) {
    try {
      await db
        .insert(table.externalAccount)
        .values(createExternalAccountValues(event.locals.session.userId));
    } catch (e) {
      console.error(e);
      return errorRedirect('При сохранении нового сервиса в БД возникла ошибка');
    }
    return redirect(302, '/profile');
  }

  if (!event.locals.session && existingExternalAccount) {
    await createSession(existingExternalAccount.userId);
    return redirect(302, '/');
  }

  if (!event.locals.session && !existingExternalAccount) {
    try {
      const userId = generateUserId();

      await db.transaction(async (tx) => {
        await tx.insert(table.user).values({ id: userId, username, avatarUrl });
        await tx.insert(table.externalAccount).values(createExternalAccountValues(userId));
      });

      await createSession(userId);
    } catch (e) {
      console.error(e);
      return errorRedirect('При сохранении нового пользователя в БД возникла ошибка');
    }
    return redirect(302, '/profile');
  }

  return errorRedirect('Произошло что-то непредвиденное...');
}
