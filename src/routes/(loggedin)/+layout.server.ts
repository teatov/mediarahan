import { redirect } from '@sveltejs/kit';
import type { ProviderName } from '$lib/providers';
import * as table from '$lib/server/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.session || !event.locals.user) {
    return redirect(302, '/login');
  }

  const data = await event.parent();

  const user = event.locals.user;

  const externalAccounts = user.externalAccounts.reduce(
    (prev, curr) => {
      prev[curr.provider] = curr;
      return prev;
    },
    {} as Partial<
      Record<
        ProviderName,
        {
          provider: table.ExternalAccount['provider'];
          externalUsername: table.ExternalAccount['externalUsername'];
          avatarUrl: table.ExternalAccount['avatarUrl'];
        }
      >
    >,
  );

  return {
    ...data,
    user: data.user!,
    avatarUrl: data.avatarUrl!,
    externalAccounts,
  };
};
