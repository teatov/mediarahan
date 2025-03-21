import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { editProfileFormSchema } from './schema';

export const load: PageServerLoad = async (event) => {
  const data = await event.parent();

  const editProfileForm = await superValidate(
    {
      username: data.user.username,
      externalAccountAvatar: data.user.externalAccounts.find(
        (externalAccount) => externalAccount.avatarUrl === data.user.avatarUrl,
      )?.provider,
    },
    zod(editProfileFormSchema),
  );

  return { ...data, editProfileForm };
};

export const actions: Actions = {
  editProfile: async (event) => {
    const form = await superValidate(event, zod(editProfileFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    console.log(form);
    return { form };
  },
};
