import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async (event) => {
  const { user } = event.locals;
  const avatarUrl = user?.externalAccounts.find(
    (externalAccount) => externalAccount.provider === user.avatarProvider,
  )?.avatarUrl;

  return {
    user: user ? { username: user.username, avatarProvider: user.avatarProvider } : null,
    avatarUrl,
  };
});
