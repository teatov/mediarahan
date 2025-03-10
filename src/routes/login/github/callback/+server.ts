import { handleAuthCallback } from '$lib/server/providers';
import type { RequestEvent } from './$types';
import github from '$lib/server/providers/github';

export async function GET(event: RequestEvent): Promise<Response> {
  return await handleAuthCallback(github, event);
}
