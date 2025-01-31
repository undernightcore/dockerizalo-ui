import { ValidatorFn } from '@angular/forms';

export const deleteAppNameValidator =
  (name: string): ValidatorFn =>
  (control) =>
    control.value !== name ? { name: true } : null;
