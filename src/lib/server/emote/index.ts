import type { EmoteSet } from '$lib/emote';
import seventv from '$lib/server/emote/seventv';

export type EmoteProvider = {
  name: string;

  getEmotes(userId: string): Promise<EmoteSet | null>;
};

const emoteProviders = [seventv];

export default emoteProviders;
