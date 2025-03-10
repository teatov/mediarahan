import type { OAuth2Tokens } from 'arctic';

export const providers = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;

export type ProviderName = (typeof providers)[number];

export type Provider = {
  oauth: {
    createAuthorizationURL(state: string, scopes: string[]): URL;
    validateAuthorizationCode(code: string): Promise<OAuth2Tokens>;
    refreshAccessToken(refreshToken: string): Promise<OAuth2Tokens>;
  };
};
