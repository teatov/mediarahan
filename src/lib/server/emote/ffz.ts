import { type Emote } from '$lib/emote';
import type { EmoteProvider } from '$lib/server/emote';

type FfzEmotes = {
  name: string;
  height: number;
  width: number;
  urls: Record<number, string>;
}[];

export const ffzPersonal: EmoteProvider = {
  name: 'FrankerFaceZ',

  getEmotes: async (userId: string) => {
    const request = new Request('https://api.frankerfacez.com/v1/user/id/' + userId);
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const { sets } = (await response.json()) as {
      sets: Record<number, { title: string; emoticons: FfzEmotes }>;
    };

    let emotes: Emote[] = [];
    for (const key in sets) {
      emotes = emotes.concat(extractEmotes(sets[key].emoticons));
    }

    return { label: 'FrankerFaceZ', emotes, order: 5 };
  },
};

export const ffzGlobal: EmoteProvider = {
  name: 'FrankerFaceZ (глобальные)',

  getEmotes: async () => {
    const request = new Request('https://api.frankerfacez.com/v1/set/global');
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const { sets } = (await response.json()) as {
      sets: Record<number, { title: string; emoticons: FfzEmotes }>;
    };

    let emotes: Emote[] = [];
    for (const key in sets) {
      emotes = emotes.concat(extractEmotes(sets[key].emoticons));
    }

    return { label: 'FrankerFaceZ - Global Emotes', emotes, order: 6 };
  },
};

function extractEmotes(emotes: FfzEmotes) {
  return emotes.map((emote): Emote => {
    return {
      name: emote.name,
      src: emote.urls[1],
      height: emote.height,
      width: emote.width,
    };
  });
}
