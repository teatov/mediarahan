import type { EmoteSet } from '$lib/emote';
import { sevenTvPersonal, sevenTvGlobal } from '$lib/server/emote/seventv';
import { twitchPersonal, twitchGlobal } from '$lib/server/emote/twitch';

export type EmoteProvider = {
  name: string;

  getEmotes(userId: string, accessToken?: string): Promise<EmoteSet | null>;
};

const emoteProviders = [sevenTvPersonal, sevenTvGlobal, twitchPersonal, twitchGlobal];

export default emoteProviders;
