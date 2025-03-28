import { fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { PROVIDER_INFO, type ProviderName } from '$lib/providers';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const providerName = event.params.provider as ProviderName;

    const externalAccounts = await db.query.externalAccount.findMany({
      where: eq(table.externalAccount.userId, event.locals.session!.userId),
    });

    const userExternalAccount = externalAccounts.find(
      (account) => account.provider === providerName,
    );

    if (!userExternalAccount) {
      return redirect(
        '/profile',
        {
          type: 'error',
          message: 'Этот сервис вообще не привязан.',
        },
        event.cookies,
      );
    }

    const userAuthProviders = externalAccounts
      .filter((account) => PROVIDER_INFO[account.provider].oauth)
      .map((externalAccount) => externalAccount.provider);

    if (externalAccounts.length <= 1) {
      return redirect(
        '/profile',
        {
          type: 'error',
          message:
            'Нельзя отвязать единственный оставшийся сервис, иначе нечего будет использовать для входа.',
        },
        event.cookies,
      );
    }

    if (PROVIDER_INFO[userExternalAccount.provider].oauth && userAuthProviders.length <= 1) {
      return redirect(
        '/profile',
        {
          type: 'error',
          message:
            'Нельзя отвязать этот сервис, поскольку другой оставшийся сервис нельзя будет использовать для входа.',
        },
        event.cookies,
      );
    }

    await db
      .delete(table.externalAccount)
      .where(
        and(
          eq(table.externalAccount.userId, event.locals.session.userId),
          eq(table.externalAccount.provider, providerName),
        ),
      );

    return redirect(302, '/profile');
  },
};
