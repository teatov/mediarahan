import { DonationAlerts, OAuth2Tokens } from 'arctic';
import {
  DONATIONALERTS_CLIENT_ID,
  DONATIONALERTS_CLIENT_SECRET,
  ORIGIN,
} from '$env/static/private';
import type { Provider } from '$lib/server/providers';

const oauth = new DonationAlerts(
  DONATIONALERTS_CLIENT_ID,
  DONATIONALERTS_CLIENT_SECRET,
  ORIGIN + '/login/donationalerts/callback'
);

function createAuthorizationURL(_: string) {
  return oauth.createAuthorizationURL([
    'oauth-donation-subscribe',
    'oauth-donation-index',
    'oauth-user-show',
  ]);
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
  const userRequest = new Request('https://www.donationalerts.com/api/v1/user/oauth');
  userRequest.headers.set('Authorization', `Bearer ${tokens.accessToken()}`);
  const userResponse = await fetch(userRequest);
  const userResult = (await userResponse.json()) as {
    data: {
      id: number;
      name: string;
      avatar: string;
      socket_connection_token: string;
    };
  };

  return {
    externalUserId: String(userResult.data.id),
    username: userResult.data.name,
    avatarUrl: userResult.data.avatar,
  };
}

export default {
  name: 'donationalerts',
  createAuthorizationURL,
  validateAuthorizationCode,
  getUserInfo,
} as Provider;
