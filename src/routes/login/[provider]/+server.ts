import { error, redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { eq, and } from 'drizzle-orm';
import { authProviders, type ProviderName } from '$lib';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import providers from '$lib/server/providers';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent): Promise<Response> {
  const providerName = event.params.provider;

  if (!Object.keys(providers).includes(providerName)) {
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

  const state = generateState();

  event.cookies.set(provider.stateCookie, state, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  });

  let codeVerifier: string | undefined = undefined;

  if (provider.verifierCookie) {
    codeVerifier = generateCodeVerifier();

    event.cookies.set(provider.verifierCookie, codeVerifier, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
    });
  }

  const url = provider.createAuthorizationURL(state, codeVerifier);

  return redirect(302, url);
}
