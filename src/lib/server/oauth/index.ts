import * as arctic from 'arctic';
import type { ProviderName } from '$lib/providers';
import donationalerts from '$lib/server/oauth/donationalerts';
import github from '$lib/server/oauth/github';
import google from '$lib/server/oauth/google';
import twitch from '$lib/server/oauth/twitch';

export type ProviderUserInfo = {
  externalUserId: string;
  username: string;
  avatarUrl?: string;
  accessToken?: string;
  accessTokenExpiresAt?: Date;
  socketToken?: string;
  refreshToken?: string;
};

export type OauthProvider = {
  name: ProviderName;
  stateCookie?: string;
  verifierCookie?: string;
  createAuthorizationURL(state?: string, codeVerifier?: string): URL;
  validateAuthorizationCode(
    code: string,
    codeVerifier?: string,
  ): Promise<arctic.OAuth2Tokens | null>;
  getUserInfo(tokens: arctic.OAuth2Tokens): Promise<ProviderUserInfo>;
};

const oauthProviders: Partial<Record<ProviderName, OauthProvider>> = {
  twitch,
  github,
  google,
  donationalerts,
};

export default oauthProviders;
