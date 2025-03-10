import { GitHub, OAuth2Tokens } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';
import type { RequestEvent } from '@sveltejs/kit';

const oauth = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ORIGIN + '/login/github/callback');

function prepareAuthUrl(state: string, event: RequestEvent) {
  const url = oauth.createAuthorizationURL(state, []);

  event.cookies.set('github_oauth_state', state, {
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    path: '/',
    sameSite: 'lax',
  });

  return url;
}

async function validateAuthToken(event: RequestEvent) {
  const storedState = event.cookies.get('github_oauth_state') ?? null;
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');

  if (!storedState || !code || !state || storedState !== state) {
    console.error({ storedState, code, state });
    return null;
  }

  try {
    return await oauth.validateAuthorizationCode(code);
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getUserInfo(tokens: OAuth2Tokens) {
  const userRequest = new Request('https://api.github.com/user');
  userRequest.headers.set('Authorization', `Bearer ${tokens.accessToken()}`);
  const userResponse = await fetch(userRequest);
  const userResult = (await userResponse.json()) as {
    login: string;
    id: number;
    avatar_url: string;
  };

  return {
    externalUserId: String(userResult.id),
    username: userResult.login,
    avatarUrl: userResult.avatar_url,
  };
}

export default {
  name: 'github',
  prepareAuthUrl,
  validateAuthToken,
  getUserInfo,
} as Provider;
