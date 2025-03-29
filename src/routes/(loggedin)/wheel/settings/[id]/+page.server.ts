import { fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { wheelSettingsFormSchema } from '../schema';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const form = await superValidate(event, zod(wheelSettingsFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { name, isPublic, ...settings } = form.data;

    try {
      await db
        .update(table.wheel)
        .set({ name, isPublic, settings })
        .where(
          and(
            eq(table.wheel.userId, event.locals.session.userId),
            eq(table.wheel.id, event.params.id),
          ),
        );
    } catch (e) {
      console.error(e);
      setFlash({ type: 'error', message: 'Ошибка при сохранении настроек колеса' }, event);
      return fail(500, { form });
    }

    setFlash({ message: 'Настройки сохранены', type: 'success' }, event);
    return { form };
  },
};
