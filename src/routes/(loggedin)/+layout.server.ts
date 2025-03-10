import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, '/login');
  }

  const data = await event.parent();
  return { ...data, user: data.user! };
};
