import { Google, OAuth2Tokens, decodeIdToken } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ORIGIN } from '$env/static/private';
import type { Provider } from '$lib/server/providers';

export const oauth = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  ORIGIN + '/login/google/callback'
);

function createAuthorizationURL(state: string, codeVerifier: string) {
  return oauth.createAuthorizationURL(state, codeVerifier, ['openid', 'profile']);
}

async function validateAuthorizationCode(code: string, codeVerifier: string) {
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
  stateCookie: 'google_oauth_state',
  verifierCookie: 'google_code_verifier',
  createAuthorizationURL,
  validateAuthorizationCode,
  getUserInfo,
} as Provider;
