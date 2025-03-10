import type { RequestEvent } from './$types';
import { handleAuthRedirect } from '$lib/server/providers';
import { error } from '@sveltejs/kit';
import { providers } from '$lib/server/providers';

export function GET(event: RequestEvent): Response {
  const providerName = event.params.provider;

  if (!Object.keys(providers).includes(providerName)) {
    return error(400, 'Такого сервиса не существует');
  }

  const provider = providers[providerName];

  return handleAuthRedirect(provider, event);
}
