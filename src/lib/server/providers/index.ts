import type { ProviderName } from '$lib';
import type { OAuth2Tokens } from 'arctic';
import type { RequestEvent } from '@sveltejs/kit';
import twitch from '$lib/server/providers/twitch';

export type ProviderUserInfo = {
  externalUserId: string;
  username: string;
  avatarUrl: string | null;
};

export type Provider = {
  name: ProviderName;
  prepareAuthUrl(state: string, event: RequestEvent): URL;
  validateAuthToken(event: RequestEvent): Promise<OAuth2Tokens | null>;
  getUserInfo(accessToken: OAuth2Tokens): Promise<ProviderUserInfo>;
};

export default { twitch } as Record<string, Provider>;
