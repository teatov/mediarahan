import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.session) {
    return redirect(302, '/');
  }

  const data = await event.parent();
  return data;
};
