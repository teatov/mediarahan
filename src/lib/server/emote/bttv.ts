import { type Emote } from '$lib/emote';
import type { EmoteProvider } from '$lib/server/emote';

type BttvEmotes = {
  id: string;
  code: string;
  imageType: string;
}[];

export const bttvPersonal: EmoteProvider = {
  name: 'BetterTTV',

  getEmotes: async (userId: string) => {
    const request = new Request('https://api.betterttv.net/3/cached/users/twitch/' + userId);
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const data = (await response.json()) as {
      channelEmotes: BttvEmotes;
      sharedEmotes: BttvEmotes;
    };

    const channelEmotes = extractEmotes(data.channelEmotes);
    const sharedEmotes = extractEmotes(data.sharedEmotes);

    return { label: 'BetterTTV', emotes: [...channelEmotes, ...sharedEmotes] };
  },
};

export const bttvGlobal: EmoteProvider = {
  name: 'BetterTTV (глобальные)',

  getEmotes: async () => {
    const request = new Request('https://api.betterttv.net/3/cached/emotes/global');
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const data = (await response.json()) as BttvEmotes;

    const emotes = extractEmotes(data);

    return { label: 'BetterTTV - Global Emotes', emotes };
  },
};

function extractEmotes(emotes: BttvEmotes) {
  return emotes.map((emote): Emote => {
    return {
      name: emote.code,
      src: `https://cdn.betterttv.net/emote/${emote.id}/1x.${emote.imageType}`,
      height: 28,
      width: 28,
    };
  });
}
