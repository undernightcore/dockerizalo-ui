import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NetworkInterface } from '../../interfaces/network.interface';
import { environment } from '../../../environments/environment';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class NetworksService {
  #http = inject(HttpClient);

  getNetworks(appId: string) {
    return this.#http.get<NetworkInterface[]>(
      `${environment.apiUrl}/apps/${appId}/networks`
    );
  }

  saveNetworks(
    appId: string,
    networks: Omit<NetworkInterface, 'id' | 'appId'>[]
  ) {
    return this.#http.patch<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/networks`,
      networks
    );
  }
}
