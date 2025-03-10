import { Google, OAuth2Tokens, generateCodeVerifier, decodeIdToken } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';
import type { RequestEvent } from '@sveltejs/kit';

export const oauth = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ORIGIN + '/login/google/callback'
);

function prepareAuthUrl(state: string, event: RequestEvent) {
  const codeVerifier = generateCodeVerifier();
  const url = oauth.createAuthorizationURL(state, codeVerifier, ['openid', 'profile']);

  event.cookies.set('google_oauth_state', state, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  });
  event.cookies.set('google_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  });

  return url;
}

async function validateAuthToken(event: RequestEvent) {
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');
  const storedState = event.cookies.get('google_oauth_state') ?? null;
  const codeVerifier = event.cookies.get('google_code_verifier') ?? null;

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    console.error({ storedState, code, state });
    return null;
  }

  try {
    return await oauth.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getUserInfo(tokens: OAuth2Tokens) {
  const claims = decodeIdToken(tokens.idToken()) as { sub: string; name: string; picture: string };

  return {
    externalUserId: claims.sub,
    username: claims.name,
    avatarUrl: claims.picture,
  };
}

export default {
  name: 'google',
  prepareAuthUrl,
  validateAuthToken,
  getUserInfo,
} as Provider;
