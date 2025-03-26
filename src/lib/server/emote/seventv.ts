import type { Emote } from '$lib/emote';
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

export const sevenTvUser: EmoteProvider = {
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

    if (import.meta.env.DEV) {
      console.log(data);
    }

    const emotes = extractEmotes(data.emote_set.emotes);
    const emoteSet = { label: '7TV - ' + data.emote_set.name, emotes };
    return [emoteSet];
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

    if (import.meta.env.DEV) {
      console.log(data);
    }

    const emotes = extractEmotes(data.emotes);
    const emoteSet = { label: '7TV - ' + data.name, emotes };
    return [emoteSet];
  },
};

function extractEmotes(emotes: SevenTvEmotes) {
  return emotes.map((emote): Emote => {
    const data = emote.data.host.files.find((file) => file.name === '2x.avif')!;

    return {
      name: emote.name,
      src: emote.data.host.url + '/' + data.name,
      height: data.height,
      width: data.width,
    };
  });
}
