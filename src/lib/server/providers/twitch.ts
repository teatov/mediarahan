import * as arctic from 'arctic';
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';

const oauth = new arctic.Twitch(
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
  ORIGIN + '/login/twitch/callback'
);

export default {
  name: 'twitch',
  stateCookie: 'twitch_oauth_state',

  createAuthorizationURL: (state: string) => {
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
  },

  validateAuthorizationCode: async (code: string) => {
    return await oauth.validateAuthorizationCode(code);
  },

  getUserInfo: async (tokens: arctic.OAuth2Tokens) => {
    const claims = arctic.decodeIdToken(tokens.idToken()) as {
      sub: string;
      preferred_username: string;
      picture: string;
    };

    if (import.meta.env.DEV) {
      console.log(claims);
    }

    return {
      externalUserId: claims.sub,
      username: claims.preferred_username,
      avatarUrl: claims.picture,
    };
  },
} as Provider;
