import * as arctic from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';

const oauth = new arctic.GitHub(
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  ORIGIN + '/login/github/callback',
);

export default {
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
} as Provider;
