import { loadFlash } from 'sveltekit-flash-message/server';
import type { User } from '$lib/server/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async (event) => {
  const user: Pick<User, 'username' | 'avatarProvider'> | null = event.locals.user
    ? {
        username: event.locals.user.username,
        avatarProvider: event.locals.user.avatarProvider,
      }
    : null;

  const avatarUrl =
    event.locals.user?.externalAccounts.find(
      (externalAccount) => externalAccount.provider === event.locals.user?.avatarProvider,
    )?.avatarUrl ?? null;

  return { user, avatarUrl };
});
