import { ValidatorFn } from '@angular/forms';

export const deleteUserEmailValidator =
  (email: string): ValidatorFn =>
  (control) =>
    control.value !== email ? { remove: true } : null;
