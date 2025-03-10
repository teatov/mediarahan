import type { RequestEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import providers from '$lib/server/providers';
import { generateState, generateCodeVerifier } from 'arctic';

export function GET(event: RequestEvent): Response {
  const providerName = event.params.provider;

  if (!Object.keys(providers).includes(providerName)) {
    return error(404, 'Такого сервиса не существует');
  }

  if (event.locals.user) {
    return redirect(302, '/');
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
