import * as arctic from 'arctic';
import { env } from '$env/dynamic/private';
import type { OauthProvider } from '$lib/server/oauth';

const oauth = new arctic.DonationAlerts(
  env.DONATIONALERTS_CLIENT_ID,
  env.DONATIONALERTS_CLIENT_SECRET,
  env.ORIGIN + '/login/donationalerts/callback',
);

const oauthProvider: OauthProvider = {
  name: 'donationalerts',

  createAuthorizationURL: () => {
    return oauth.createAuthorizationURL([
      'oauth-donation-subscribe',
      'oauth-donation-index',
      'oauth-user-show',
    ]);
  },

  validateAuthorizationCode: async (code: string) => {
    return await oauth.validateAuthorizationCode(code);
  },

  getUserInfo: async (tokens: arctic.OAuth2Tokens) => {
    const accessToken = tokens.accessToken();
    const request = new Request('https://www.donationalerts.com/api/v1/user/oauth');
    request.headers.set('Authorization', `Bearer ${accessToken}`);
    const response = await fetch(request);
    const { data } = (await response.json()) as {
      data: {
        id: number;
        name: string;
        avatar: string;
        socket_connection_token: string;
      };
    };

    if (import.meta.env.DEV) {
      console.log(data);
    }

    return {
      externalUserId: String(data.id),
      username: data.name,
      avatarUrl: data.avatar,
      socketToken: data.socket_connection_token,
      accessToken: accessToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt(),
      refreshToken: tokens.refreshToken(),
    };
  },
};

export default oauthProvider;
