import * as arctic from 'arctic';
import { env } from '$env/dynamic/private';
import type { OauthProvider } from '$lib/server/oauth';

const oauth = new arctic.GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  env.ORIGIN + '/login/github/callback',
);

const oauthProvider: OauthProvider = {
  name: 'github',
  stateCookie: 'github_oauth_state',

  createAuthorizationURL: (state: string) => {
    return oauth.createAuthorizationURL(state, []);
  },

  validateAuthorizationCode: async (code: string) => {
    return await oauth.validateAuthorizationCode(code);
  },

  getUserInfo: async (tokens: arctic.OAuth2Tokens) => {
    const request = new Request('https://api.github.com/user');
    request.headers.set('Authorization', `Bearer ${tokens.accessToken()}`);
    const response = await fetch(request);
    const data = (await response.json()) as {
      login: string;
      id: number;
      avatar_url: string;
    };

    if (import.meta.env.DEV) {
      console.log(data);
    }

    return {
      externalUserId: String(data.id),
      username: data.login,
      avatarUrl: data.avatar_url,
    };
  },
};

export default oauthProvider;
