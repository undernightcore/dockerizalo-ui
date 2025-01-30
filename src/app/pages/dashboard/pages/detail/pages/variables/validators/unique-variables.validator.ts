import { ValidatorFn } from '@angular/forms';
import { toSet } from '../../../../../../../utils/array.utils';
import { VariableInterface } from '../../../../../../../interfaces/variable.interface';

export const uniqueVariablesValidator: ValidatorFn = (control) => {
  const variables = control.value as Omit<VariableInterface, 'id' | 'appId'>[];
  const unique = toSet(variables, (variable) => variable.key);

  return unique.size !== variables.length ? { conflicting: true } : null;
};
