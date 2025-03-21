import { z } from 'zod';

export const globalErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (import.meta.env.DEV) {
    console.log(issue);
  }

  switch (issue.code) {
    case z.ZodIssueCode.too_small:
      if (issue.type === 'string') {
        return { message: `Длина должна быть не менее ${issue.minimum}` };
      }
      return { message: `Значение должно быть не менее ${issue.minimum}` };

    case z.ZodIssueCode.too_big:
      if (issue.type === 'string') {
        return { message: `Длина должна быть не более ${issue.maximum}` };
      }
      return { message: `Значение должно быть не более ${issue.maximum}` };
  }

  return { message: ctx.defaultError };
};
