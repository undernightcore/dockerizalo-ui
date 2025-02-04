import { ValidatorFn } from '@angular/forms';
import { toSet } from '../../../../../../../utils/array.utils';
import { NetworkInterface } from '../../../../../../../interfaces/network.interface';

export const uniqueNetworksValidator: ValidatorFn = (control) => {
  const networks = control.value as Omit<NetworkInterface, 'id' | 'appId'>[];
  const unique = toSet(networks, (network) => network.name);

  return unique.size !== networks.length ? { conflicting: true } : null;
};
