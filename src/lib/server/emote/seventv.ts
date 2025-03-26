import { type Emote } from '$lib/emote';
import type { EmoteProvider } from '$lib/server/emote';

type SevenTvEmotes = {
  name: string;
  data: {
    host: {
      url: string;
      files: {
        name: string;
        height: number;
        width: number;
        size: number;
        format: string;
      }[];
    };
  };
}[];

export const sevenTvPersonal: EmoteProvider = {
  name: '7TV',

  getEmotes: async (userId: string) => {
    const request = new Request('https://7tv.io/v3/users/twitch/' + userId);
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const data = (await response.json()) as {
      emote_set: {
        name: string;
        emotes: SevenTvEmotes;
      };
    };

    const emotes = extractEmotes(data.emote_set.emotes);

    return { label: '7TV - ' + data.emote_set.name, emotes, order: 0 };
  },
};

export const sevenTvGlobal: EmoteProvider = {
  name: '7TV (глобальные)',

  getEmotes: async () => {
    const request = new Request('https://7tv.io/v3/emote-sets/global');
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const data = (await response.json()) as {
      name: string;
      emotes: SevenTvEmotes;
    };

    const emotes = extractEmotes(data.emotes);

    return { label: '7TV - ' + data.name, emotes, order: 1 };
  },
};

function extractEmotes(emotes: SevenTvEmotes) {
  return emotes.map((emote): Emote => {
    const data = emote.data.host.files.find((file) => file.name === '1x.avif')!;

    return {
      name: emote.name,
      src: emote.data.host.url + '/' + data.name,
      height: data.height,
      width: data.width,
    };
  });
}
