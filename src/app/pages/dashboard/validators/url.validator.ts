import { ValidatorFn } from '@angular/forms';
import { string } from 'zod';

export const urlValidator: ValidatorFn = (control) => {
  const value = control.value;

  return string(value).url().safeParse(value).error ? { url: true } : null;
};
