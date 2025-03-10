import github from '$lib/server/providers/github';
import { generateState } from 'arctic';
import type { RequestEvent } from './$types';
import { redirect } from '@sveltejs/kit';

export function GET(event: RequestEvent): Response {
  if (event.locals.user) {
    return redirect(302, '/');
  }

  const state = generateState();
  const url = github.oauth.createAuthorizationURL(state, ['user:email']);

  event.cookies.set('github_oauth_state', state, {
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    path: '/',
    sameSite: 'lax',
  });

  return redirect(302, url);
}
