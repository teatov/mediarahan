import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import db from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const data = await event.parent();

  const wheel = await db.query.wheel.findFirst({
    where: and(eq(table.wheel.id, event.params.id), eq(table.wheel.isPublic, true)),
    columns: { name: true },
  });

  if (!wheel) {
    error(404);
  }

  return { ...data, wheel };
};
