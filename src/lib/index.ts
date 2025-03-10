import type { OAuth2Tokens } from 'arctic';
import type { RequestEvent } from '@sveltejs/kit';

export const providers = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;

export type ProviderName = (typeof providers)[number];
export type ProviderUserInfo = { userId: string; username: string; avatarUrl: string | null };

export type Provider = {
  name: ProviderName;
  oauth: {
    createAuthorizationURL(state: string, scopes: string[]): URL;
    validateAuthorizationCode(code: string): Promise<OAuth2Tokens>;
    refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens>;
  };
  setOauthCookie(state: string, event: RequestEvent): URL;
  validateOauthToken(event: RequestEvent): Promise<OAuth2Tokens | null>;
  requestUserInfo(accessToken: string): Promise<ProviderUserInfo>;
};
