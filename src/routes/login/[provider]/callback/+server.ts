import { handleAuthCallback } from '$lib/server/providers';
import type { RequestEvent } from './$types';
import { providers } from '$lib/server/providers';
import { error } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
  const providerName = event.params.provider;

  if (!Object.keys(providers).includes(providerName)) {
    return error(400, 'Такого сервиса не существует');
  }

  const provider = providers[providerName];

  return await handleAuthCallback(provider, event);
}
