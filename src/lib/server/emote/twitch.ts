import { env } from '$env/dynamic/private';
import { type Emote } from '$lib/emote';
import type { EmoteProvider } from '$lib/server/emote';

type TwitchEmotes = {
  name: string;
  images: { url_1x: string; url_2x: string; url_3x: string };
}[];

export const twitchPersonal: EmoteProvider = {
  name: 'Twitch',

  getEmotes: async (userId: string, accessToken: string) => {
    const url = new URL('https://api.twitch.tv/helix/chat/emotes');
    url.searchParams.set('broadcaster_id', userId);
    const request = new Request(url);
    request.headers.set('Authorization', `Bearer ${accessToken}`);
    request.headers.set('Client-Id', env.TWITCH_CLIENT_ID);
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const { data } = (await response.json()) as {
      data: TwitchEmotes;
    };

    const emotes = extractEmotes(data);

    return { label: 'Twitch', emotes, order: 7 };
  },
};

export const twitchGlobal: EmoteProvider = {
  name: 'Twitch (глобальные)',

  getEmotes: async (_: string, accessToken: string) => {
    const request = new Request('https://api.twitch.tv/helix/chat/emotes/global');
    request.headers.set('Authorization', `Bearer ${accessToken}`);
    request.headers.set('Client-Id', env.TWITCH_CLIENT_ID);
    const response = await fetch(request);

    if (response.status !== 200) {
      return null;
    }

    const { data } = (await response.json()) as {
      data: TwitchEmotes;
    };

    const emotes = extractEmotes(data);

    return { label: 'Twitch - Global Emotes', emotes, order: 8 };
  },
};

function extractEmotes(emotes: TwitchEmotes) {
  return emotes.map((emote): Emote => {
    return {
      name: emote.name,
      src: emote.images.url_1x,
      height: 28,
      width: 28,
    };
  });
}
