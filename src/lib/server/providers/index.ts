import type { OAuth2Tokens } from 'arctic';
import type { ProviderName } from '$lib';
import donationalerts from '$lib/server/providers/donationalerts';
import github from '$lib/server/providers/github';
import google from '$lib/server/providers/google';
import twitch from '$lib/server/providers/twitch';

export type ProviderUserInfo = {
  externalUserId: string;
  username: string;
  avatarUrl: string | null;
};

export type Provider = {
  name: ProviderName;
  stateCookie: string;
  verifierCookie?: string;
  createAuthorizationURL(state: string, codeVerifier?: string): URL;
  validateAuthorizationCode(code: string, codeVerifier?: string): Promise<OAuth2Tokens | null>;
  getUserInfo(accessToken: OAuth2Tokens): Promise<ProviderUserInfo>;
};

export default { twitch, github, google, donationalerts } as Record<string, Provider>;
