import type { Wheel } from '$lib/server/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const data = await event.parent();

  const currentWheel = event.locals.user!.currentWheel;

  const wheel: Pick<Wheel, 'name'> | null = currentWheel
    ? {
        name: currentWheel.name,
      }
    : null;

  return { ...data, currentWheel: wheel };
};
