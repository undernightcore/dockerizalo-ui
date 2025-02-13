import { ValidatorFn } from '@angular/forms';
import { toSet } from '../../../../../../../utils/array.utils';
import { LabelInterface } from '../../../../../../../interfaces/label.interface';

export const uniqueLabelsValidator: ValidatorFn = (control) => {
  const labels = control.value as Omit<LabelInterface, 'id' | 'appId'>[];
  const unique = toSet(labels, (label) => label.key);

  return unique.size !== labels.length ? { conflicting: true } : null;
};
