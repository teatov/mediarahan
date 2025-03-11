import * as arctic from 'arctic';
import {
  DONATIONALERTS_CLIENT_ID,
  DONATIONALERTS_CLIENT_SECRET,
  ORIGIN,
} from '$env/static/private';
import type { Provider } from '$lib/server/providers';

const oauth = new arctic.DonationAlerts(
  DONATIONALERTS_CLIENT_ID,
  DONATIONALERTS_CLIENT_SECRET,
  ORIGIN + '/login/donationalerts/callback'
);

export default {
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
    const request = new Request('https://www.donationalerts.com/api/v1/user/oauth');
    request.headers.set('Authorization', `Bearer ${tokens.accessToken()}`);
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
    };
  },
} as Provider;
