import { GitHub, OAuth2Tokens } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';

const oauth = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ORIGIN + '/login/github/callback');

function createAuthorizationURL(state: string) {
  return oauth.createAuthorizationURL(state, []);
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
  stateCookie: 'github_oauth_state',
  createAuthorizationURL,
  validateAuthorizationCode,
  getUserInfo,
} as Provider;
