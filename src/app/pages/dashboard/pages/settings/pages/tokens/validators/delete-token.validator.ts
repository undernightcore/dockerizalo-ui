import { ValidatorFn } from '@angular/forms';

export const deleteTokenNameValidator =
  (name: string): ValidatorFn =>
  (control) =>
    control.value !== name ? { name: true } : null;
