import type { EmoteSet } from '$lib/emote';
import { sevenTvPersonal, sevenTvGlobal } from '$lib/server/emote/seventv';

export type EmoteProvider = {
  name: string;

  getEmotes(userId: string): Promise<EmoteSet | null>;
};

const emoteProviders = [sevenTvPersonal, sevenTvGlobal];

export default emoteProviders;
