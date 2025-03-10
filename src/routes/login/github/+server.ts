import type { RequestEvent } from './$types';
import { handleAuthRedirect } from '$lib/server/providers';
import github from '$lib/server/providers/github';

export function GET(event: RequestEvent): Response {
  return handleAuthRedirect(github, event);
}
