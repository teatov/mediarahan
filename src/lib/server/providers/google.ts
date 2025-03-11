import * as arctic from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';

export const oauth = new arctic.Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ORIGIN + '/login/google/callback'
);

export default {
  name: 'google',
  stateCookie: 'google_oauth_state',
  verifierCookie: 'google_code_verifier',

  createAuthorizationURL: (state: string, codeVerifier: string) => {
    return oauth.createAuthorizationURL(state, codeVerifier, ['openid', 'profile']);
  },

  validateAuthorizationCode: async (code: string, codeVerifier: string) => {
    return await oauth.validateAuthorizationCode(code, codeVerifier);
  },

  getUserInfo: async (tokens: arctic.OAuth2Tokens) => {
    const claims = arctic.decodeIdToken(tokens.idToken()) as {
      sub: string;
      name: string;
      picture: string;
    };

    return {
      externalUserId: claims.sub,
      username: claims.name,
      avatarUrl: claims.picture,
    };
  },
} as Provider;
