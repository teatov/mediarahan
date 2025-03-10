import { handleAuthCallback } from '$lib/server/providers';
import type { RequestEvent } from './$types';
import google from '$lib/server/providers/google';

export async function GET(event: RequestEvent): Promise<Response> {
  return await handleAuthCallback(google, event);
}
