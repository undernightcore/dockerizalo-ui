import { ValidatorFn } from '@angular/forms';
import { PortInterface } from '../../../../../../../interfaces/ports.interface';
import { toSet } from '../../../../../../../utils/array.utils';

export const uniquePortsValidator: ValidatorFn = (control) => {
  const ports = control.value as Omit<PortInterface, 'id' | 'appId'>[];
  const unique = toSet(ports, (port) => port.external);

  return unique.size !== ports.length ? { conflicting: true } : null;
};
