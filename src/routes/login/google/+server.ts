import type { RequestEvent } from './$types';
import { handleAuthRedirect } from '$lib/server/providers';
import google from '$lib/server/providers/google';

export function GET(event: RequestEvent): Response {
  return handleAuthRedirect(google, event);
}
