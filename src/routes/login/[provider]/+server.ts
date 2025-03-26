import * as arctic from 'arctic';
import type { CookieSerializeOptions } from 'cookie';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { providerInfo, type ProviderName } from '$lib/providers';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import oauthProviders from '$lib/server/oauth';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent): Promise<Response> {
  const providerName = event.params.provider as ProviderName;

  function errorRedirect(message: string) {
    return redirect(
      event.locals.session ? '/profile' : '/login',
      { type: 'error', message },
      event,
    );
  }

  if (!Object.keys(oauthProviders).includes(providerName)) {
    return errorRedirect('Такого сервиса не существует');
  }

  if (event.locals.session) {
    const existingExternalAccount = await db.query.externalAccount.findFirst({
      where: and(
        eq(table.externalAccount.provider, providerName),
        eq(table.externalAccount.userId, event.locals.session.userId),
      ),
    });

    if (existingExternalAccount) {
      return errorRedirect('Этот сервис уже привязан');
    }
  } else if (!providerInfo[providerName].oauth) {
    return errorRedirect('Этот сервис не предназначен для входа');
  }

  const oauthProvider = oauthProviders[providerName]!;

  let state: string | undefined = undefined;
  const cookieOptions: CookieSerializeOptions & { path: string } = {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  };

  if (oauthProvider.stateCookie) {
    state = arctic.generateState();
    event.cookies.set(oauthProvider.stateCookie, state, cookieOptions);
  }

  let codeVerifier: string | undefined = undefined;
  if (oauthProvider.verifierCookie) {
    codeVerifier = arctic.generateCodeVerifier();
    event.cookies.set(oauthProvider.verifierCookie, codeVerifier, cookieOptions);
  }

  const url = oauthProvider.createAuthorizationURL(state, codeVerifier);

  return redirect(302, url);
}
