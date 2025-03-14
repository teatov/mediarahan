import * as arctic from 'arctic';
import type { CookieSerializeOptions } from 'cookie';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { authProviders, type ProviderName } from '$lib/providers';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import providers from '$lib/server/providers';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent): Promise<Response> {
  const providerName = event.params.provider;

  function errorRedirect(message: string) {
    return redirect(
      event.locals.session ? '/profile' : '/login',
      { type: 'error', message },
      event
    );
  }

  if (!Object.keys(providers).includes(providerName)) {
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

  let state: string;
  const cookieOptions: CookieSerializeOptions & { path: string } = {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  };

  if (provider.stateCookie) {
    state = arctic.generateState();
    event.cookies.set(provider.stateCookie, state, cookieOptions);
  }

  let codeVerifier: string;

  if (provider.verifierCookie) {
    codeVerifier = arctic.generateCodeVerifier();
    event.cookies.set(provider.verifierCookie, codeVerifier, cookieOptions);
  }

  const url = provider.createAuthorizationURL(state, codeVerifier);

  return redirect(302, url);
}
