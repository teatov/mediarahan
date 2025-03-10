import type { OAuth2Tokens } from 'arctic';
import type { RequestEvent } from '@sveltejs/kit';

export const providers = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;

export type ProviderName = (typeof providers)[number];
export type ProviderUserInfo = { externalUserId: string; username: string; avatarUrl: string | null };

export type Provider = {
  name: ProviderName;
  setOauthCookie(state: string, event: RequestEvent): URL;
  validateOauthToken(event: RequestEvent): Promise<OAuth2Tokens | null>;
  requestUserInfo(accessToken: OAuth2Tokens): Promise<ProviderUserInfo>;
};
