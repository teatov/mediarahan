import * as arctic from 'arctic';
import { env } from '$env/dynamic/private';
import type { OauthProvider } from '$lib/server/oauth';

const oauth = new arctic.Twitch(
  env.TWITCH_CLIENT_ID,
  env.TWITCH_CLIENT_SECRET,
  env.ORIGIN + '/login/twitch/callback',
);

const oauthProvider: OauthProvider = {
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
      }),
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
      accessToken: tokens.accessToken(),
    };
  },
};

export default oauthProvider;
