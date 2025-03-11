import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const data = await event.parent();

  if (event.locals.session) {
    return redirect(302, '/profile');
  }

  return data;
};
