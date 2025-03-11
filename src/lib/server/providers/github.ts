import * as arctic from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';

const oauth = new arctic.GitHub(
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  ORIGIN + '/login/github/callback'
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
  },
} as Provider;
