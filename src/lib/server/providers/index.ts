import * as arctic from 'arctic';
import type { ProviderName } from '$lib/providers';
import donationalerts from '$lib/server/providers/donationalerts';
import github from '$lib/server/providers/github';
import google from '$lib/server/providers/google';
import twitch from '$lib/server/providers/twitch';

export type ProviderUserInfo = {
  externalUserId: string;
  username: string;
  avatarUrl: string | null;
  accessToken: string | null;
  socketToken: string | null;
};

export type Provider = {
  name: ProviderName;
  stateCookie?: string;
  verifierCookie?: string;
  createAuthorizationURL(state?: string, codeVerifier?: string): URL;
  validateAuthorizationCode(
    code: string,
    codeVerifier?: string
  ): Promise<arctic.OAuth2Tokens | null>;
  getUserInfo(tokens: arctic.OAuth2Tokens): Promise<ProviderUserInfo>;
};

export default { twitch, github, google, donationalerts } as Record<string, Provider>;
