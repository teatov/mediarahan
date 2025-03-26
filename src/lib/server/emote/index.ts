import type { EmoteSet } from '$lib/emote';
import type { ProviderName } from '$lib/providers';

export type EmoteProvider = {
  name: ProviderName;
  getEmotes(): Promise<EmoteSet[]>;
};

const emoteProviders: Partial<Record<ProviderName, EmoteProvider>> = {};

export default emoteProviders;
