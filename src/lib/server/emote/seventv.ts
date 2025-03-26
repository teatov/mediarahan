import type { Emote } from '$lib/emote';
import type { EmoteProvider } from '$lib/server/emote';

const emoteProvider: EmoteProvider = {
  name: '7TV',

  getEmotes: async (userId: string) => {
    const request = new Request('https://7tv.io/v3/users/twitch/' + userId);
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const { emote_set: emoteSet } = (await response.json()) as {
      emote_set: {
        name: string;
        emotes: {
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
      };
    };

    if (import.meta.env.DEV) {
      console.log(emoteSet);
    }

    const emotes = emoteSet.emotes.map((emote): Emote => {
      const data = emote.data.host.files.find((file) => file.name === '2x.avif')!;

      return {
        name: emote.name,
        src: emote.data.host.url + '/' + data.name,
        height: data.height,
        width: data.width,
      };
    });

    return { label: '7TV - ' + emoteSet.name, emotes };
  },
};

export default emoteProvider;
