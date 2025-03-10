import { Twitch, OAuth2Tokens, decodeIdToken } from 'arctic';
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';

const oauth = new Twitch(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, ORIGIN + '/login/twitch/callback');

function createAuthorizationURL(state: string) {
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
  return url;
}

async function validateAuthorizationCode(code: string) {
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
  stateCookie: 'twitch_oauth_state',
  createAuthorizationURL,
  validateAuthorizationCode,
  getUserInfo,
} as Provider;
