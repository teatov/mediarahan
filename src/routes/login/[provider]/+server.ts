import type { RequestEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import providers from '$lib/server/providers';
import { generateState } from 'arctic';

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
  const url = provider.prepareAuthUrl(state, event);

  return redirect(302, url);
}
