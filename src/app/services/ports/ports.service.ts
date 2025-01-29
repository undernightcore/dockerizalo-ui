import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PortInterface } from '../../interfaces/ports.interface';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class PortsService {
  #http = inject(HttpClient);

  getPorts(appId: string) {
    return this.#http.get<PortInterface[]>(
      `${environment.apiUrl}/apps/${appId}/ports`
    );
  }

  savePorts(appId: string, ports: Omit<PortInterface, 'id' | 'appId'>[]) {
    return this.#http.patch<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/ports`,
      ports
    );
  }
}
