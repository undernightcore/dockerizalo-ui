import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VolumeInterface } from '../../interfaces/volume.interface';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class VolumesService {
  #http = inject(HttpClient);

  getVolumes(appId: string) {
    return this.#http.get<VolumeInterface[]>(
      `${environment.apiUrl}/apps/${appId}/mounts`
    );
  }

  saveVolumes(appId: string, volumes: Omit<VolumeInterface, 'id' | 'appId'>[]) {
    return this.#http.patch<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/mounts`,
      volumes
    );
  }
}
