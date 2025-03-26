import type { EmoteSet } from '$lib/emote';
import { sevenTvUser, sevenTvGlobal } from '$lib/server/emote/seventv';

export type EmoteProvider = {
  name: string;

  getEmotes(userId: string): Promise<EmoteSet[] | null>;
};

const emoteProviders = [sevenTvUser, sevenTvGlobal];

export default emoteProviders;
