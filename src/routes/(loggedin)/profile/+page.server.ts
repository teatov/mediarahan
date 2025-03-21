import { fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { ProviderName } from '$lib/providers';
import * as auth from '$lib/server/auth';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { getUserInfo } from '$lib/server/providers/donatepay';
import type { PageServerLoad, Actions } from './$types';
import { editProfileFormSchema, donatePayLoginFormSchema } from './schema';

export const load: PageServerLoad = async (event) => {
  const data = await event.parent();

  const editProfileForm = await superValidate(
    {
      username: data.user.username,
      avatarProvider: data.user.externalAccounts.find(
        (externalAccount) => externalAccount.provider === data.user.avatarProvider,
      )?.provider,
    },
    zod(editProfileFormSchema),
  );
  const donatePayLoginForm = await superValidate(zod(donatePayLoginFormSchema));

  return { ...data, editProfileForm, donatePayLoginForm };
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
};
