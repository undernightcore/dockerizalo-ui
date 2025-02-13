import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LabelInterface } from '../../interfaces/label.interface';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class LabelsService {
  #http = inject(HttpClient);

  getLabels(appId: string) {
    return this.#http.get<LabelInterface[]>(
      `${environment.apiUrl}/apps/${appId}/labels`
    );
  }

  saveLabels(appId: string, labels: Omit<LabelInterface, 'id' | 'appId'>[]) {
    return this.#http.patch<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/labels`,
      labels
    );
  }
}
