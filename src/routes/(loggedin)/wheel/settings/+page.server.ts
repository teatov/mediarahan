import { encodeBase64url } from '@oslojs/encoding';
import { fail } from '@sveltejs/kit';
import crypto from 'crypto';
import { eq, and, desc } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { wheelSettingsSchema } from '$lib/zod/wheel-settings';
import type { PageServerLoad, Actions } from './$types';
import { currentWheelFormSchema, newWheelFormSchema, wheelSettingsFormSchema } from './schema';

export const load: PageServerLoad = async (event) => {
  const data = await event.parent();

  const currentWheelForm = await superValidate(
    { currentWheelId: event.locals.user!.currentWheelId ?? undefined },
    zod(currentWheelFormSchema),
  );
  const newWheelForm = await superValidate(zod(newWheelFormSchema));

  const currentWheel = event.locals.user!.currentWheel;
  const wheelSettingsForm = currentWheel
    ? await superValidate(
        { ...currentWheel.settings, name: currentWheel.name },
        zod(wheelSettingsFormSchema),
      )
    : null;

  const wheels = await db.query.wheel.findMany({
    where: eq(table.wheel.userId, event.locals.session!.userId),
    columns: { id: true, name: true, createdAt: true },
    orderBy: desc(table.wheel.createdAt),
  });

  return { ...data, currentWheelForm, newWheelForm, wheelSettingsForm, wheels };
};

export const actions: Actions = {
  newWheel: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const form = await superValidate(event, zod(newWheelFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const bytes = crypto.getRandomValues(new Uint8Array(18));
    const wheelId = encodeBase64url(bytes);

    try {
      await db.transaction(async (tx) => {
        await tx.insert(table.wheel).values({
          id: wheelId,
          name: form.data.name,
          userId: event.locals.session!.userId,
          settings: wheelSettingsSchema.parse({}),
        });
        await tx
          .update(table.user)
          .set({ currentWheelId: wheelId })
          .where(eq(table.user.id, event.locals.session!.userId));
      });
    } catch (e) {
      console.error(e);
      setFlash({ type: 'error', message: 'Ошибка при сохранении нового колеса' }, event);
      return fail(500, { form });
    }

    return { form };
  },

  currentWheel: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    const form = await superValidate(event, zod(currentWheelFormSchema));
    if (!form.valid || !form.data.currentWheelId) {
      return fail(400, { form });
    }

    const existingWheel = await db.query.wheel.findFirst({
      where: and(
        eq(table.wheel.id, form.data.currentWheelId),
        eq(table.wheel.userId, event.locals.session.userId),
      ),
    });

    if (!existingWheel) {
      setFlash({ type: 'error', message: 'Колесо не найдено' }, event);
      return fail(400, { form });
    }

    try {
      await db
        .update(table.user)
        .set({ currentWheelId: form.data.currentWheelId })
        .where(eq(table.user.id, event.locals.session.userId));
    } catch (e) {
      console.error(e);
      setFlash({ type: 'error', message: 'Ошибка при обновлении текущего колеса' }, event);
      return fail(500, { form });
    }

    return { form };
  },
};
