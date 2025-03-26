import type { EmoteSet } from '$lib/emote';
import { sevenTvPersonal, sevenTvGlobal } from '$lib/server/emote/seventv';
import { twitchPersonal, twitchGlobal } from '$lib/server/emote/twitch';
import { bttvGlobal, bttvPersonal } from './bttv';
import { ffzGlobal, ffzPersonal } from './ffz';

export type EmoteProvider = {
  name: string;

  getEmotes(userId: string, accessToken?: string): Promise<EmoteSet | null>;
};

const emoteProviders = [
  sevenTvPersonal,
  sevenTvGlobal,
  bttvPersonal,
  bttvGlobal,
  ffzPersonal,
  ffzGlobal,
  twitchPersonal,
  twitchGlobal,
];

export default emoteProviders;
