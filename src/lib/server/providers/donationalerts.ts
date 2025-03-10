import { OAuth2Tokens } from 'arctic';
import { createOAuth2Request, sendTokenRequest } from 'arctic/dist/request';
import {
  DONATIONALERTS_CLIENT_ID,
  DONATIONALERTS_CLIENT_SECRET,
  ORIGIN,
} from '$env/static/private';
import type { Provider } from '$lib/server/providers';

class DonationAlerts {
  private clientId: string;
  private clientSecret: string;
  private redirectURI: string;

  constructor(clientId: string, clientSecret: string, redirectURI: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectURI = redirectURI;
  }

  public createAuthorizationURL(state: string, scopes: string[]): URL {
    const url = new URL('https://www.donationalerts.com/oauth/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('state', state);
    url.searchParams.set('scope', scopes.join(' '));
    url.searchParams.set('redirect_uri', this.redirectURI);
    return url;
  }

  public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.redirectURI);
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    const request = createOAuth2Request('https://www.donationalerts.com/oauth/token', body);
    const tokens = await sendTokenRequest(request);
    return tokens;
  }
}

const oauth = new DonationAlerts(
  DONATIONALERTS_CLIENT_ID,
  DONATIONALERTS_CLIENT_SECRET,
  ORIGIN + '/login/donationalerts/callback'
);

function createAuthorizationURL(state: string) {
  return oauth.createAuthorizationURL(state, [
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
  stateCookie: 'donationalerts_oauth_state',
  createAuthorizationURL,
  validateAuthorizationCode,
  getUserInfo,
} as Provider;
