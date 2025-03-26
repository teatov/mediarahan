import { fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { EmoteSet } from '$lib/emote';
import type { ProviderName } from '$lib/providers';
import * as auth from '$lib/server/auth';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import emoteProviders from '$lib/server/emote';
import { getUserInfo } from '$lib/server/oauth/donatepay';
import type { PageServerLoad, Actions } from './$types';
import { editProfileFormSchema, donatePayLoginFormSchema } from './schema';

export const load: PageServerLoad = async (event) => {
  const data = await event.parent();

  const editProfileForm = await superValidate(
    {
      username: data.user.username,
      avatarProvider: data.user.avatarProvider,
    },
    zod(editProfileFormSchema),
  );
  const donatePayLoginForm = await superValidate(zod(donatePayLoginFormSchema));

  return { ...data, editProfileForm, donatePayLoginForm, emotes: event.locals.user!.emotes };
};

export const actions: Actions = {
  editProfile: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const form = await superValidate(event, zod(editProfileFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    await db
      .update(table.user)
      .set({ username: form.data.username, avatarProvider: form.data.avatarProvider })
      .where(eq(table.user.id, event.locals.session!.userId));

    return { form };
  },

  donatePayLogin: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const form = await superValidate(event, zod(donatePayLoginFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    function errorRedirect(message: string) {
      return redirect('/profile', { type: 'error', message }, event);
    }

    const providerName: ProviderName = 'donatepay';

    const { externalUserId, username, avatarUrl, socketToken, accessToken } = await getUserInfo(
      form.data.token,
    );

    const existingExternalAccount = await db.query.externalAccount.findFirst({
      where: and(
        eq(table.externalAccount.provider, providerName),
        eq(table.externalAccount.externalUserId, externalUserId),
      ),
    });

    if (existingExternalAccount) {
      return errorRedirect('К этому аккаунту уже привязан кто-то другой');
    }

    try {
      await db.insert(table.externalAccount).values({
        userId: event.locals.session.userId,
        provider: providerName,
        externalUserId,
        externalUsername: username,
        socketTokenEncrypted: auth.encryptToken(socketToken!),
        accessTokenEncrypted: auth.encryptToken(accessToken!),
        avatarUrl,
      });
    } catch (e) {
      console.error(e);
      return errorRedirect('При сохранении нового сервиса в БД возникла ошибка');
    }

    return { form };
  },

  deleteAccount: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    await db.delete(table.user).where(eq(table.user.id, event.locals.session.userId));

    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);
    redirect(302, '/');
  },

  updateEmotes: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const form = await superValidate(event, zod(z.object({})));

    const twitchUserId = event.locals.user?.externalAccounts.find(
      (externalAccount) => externalAccount.provider === 'twitch',
    )?.externalUserId;

    if (!twitchUserId) {
      return fail(401);
    }

    const emoteSets: EmoteSet[] = [];

    await Promise.all(
      emoteProviders.map(async (emoteProvider) => {
        try {
          const emoteSet = await emoteProvider.getEmotes(twitchUserId);
          if (emoteSet) {
            emoteSets.push(emoteSet);
          }
        } catch (e) {
          console.error(e);
          setFlash(
            { type: 'error', message: 'Не удалось запросить смайлики у ' + emoteProvider.name },
            event,
          );
        }
      }),
    );

    if (import.meta.env.DEV) {
      console.log(emoteSets);
    }

    try {
      await db
        .update(table.user)
        .set({ emotes: emoteSets })
        .where(eq(table.user.id, event.locals.session.userId));
    } catch (e) {
      console.error(e);
      setFlash({ type: 'error', message: 'Ошибка при сохранении нового набора смайликов' }, event);
    }

    return { form };
  },
};
