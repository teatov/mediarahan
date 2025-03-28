// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/auth').SessionValidationResult['user'];
      session: import('$lib/server/auth').SessionValidationResult['session'];
    }
    interface PageData {
      flash?: { type?: 'success' | 'error'; message: string; description?: string };
    }
  }

  type IconProps = import('svelte/elements').SVGAttributes<SVGSVGElement> & {
    color?: string;
    size?: number | string;
    stroke?: number | string;
    class?: string;
  };
}

export {};
