import { Twitch, OAuth2Tokens, decodeIdToken } from 'arctic';
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';
import type { RequestEvent } from '@sveltejs/kit';

const oauth = new Twitch(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, ORIGIN + '/login/twitch/callback');

function prepareAuthUrl(state: string, event: RequestEvent) {
  const url = oauth.createAuthorizationURL(state, ['openid']);
  url.searchParams.set(
    'claims',
    JSON.stringify({
      id_token: {
        picture: null,
        preferred_username: null,
      },
    })
  );

  event.cookies.set('twitch_oauth_state', state, {
    httpOnly: true,
    maxAge: 60 * 10,
    secure: import.meta.env.PROD,
    path: '/',
    sameSite: 'lax',
  });

  return url;
}

async function validateAuthToken(event: RequestEvent) {
  const storedState = event.cookies.get('twitch_oauth_state') ?? null;
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
  const claims = decodeIdToken(tokens.idToken()) as {
    sub: string;
    preferred_username: string;
    picture: string;
  };

  return {
    externalUserId: claims.sub,
    username: claims.preferred_username,
    avatarUrl: claims.picture,
  };
}

export default {
  name: 'twitch',
  prepareAuthUrl,
  validateAuthToken,
  getUserInfo,
} as Provider;
