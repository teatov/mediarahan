import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { PageServerLoad, Actions } from './$types';
import { editProfileFormSchema } from './schema';

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

  return { ...data, editProfileForm };
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
};
