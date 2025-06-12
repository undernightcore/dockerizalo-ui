import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MessageInterface } from '../../interfaces/message.interface';
import {
  CreateTriggerInterface,
  TriggerInterface,
} from '../../interfaces/trigger.interface';

@Injectable({
  providedIn: 'root',
})
export class TriggersService {
  #http = inject(HttpClient);

  getTriggers(appId: string) {
    return this.#http.get<TriggerInterface[]>(
      `${environment.apiUrl}/apps/${appId}/triggers`
    );
  }

  createTrigger(appId: string, trigger: CreateTriggerInterface) {
    return this.#http.post<TriggerInterface>(
      `${environment.apiUrl}/apps/${appId}/triggers`,
      trigger
    );
  }

  editTrigger(
    appId: string,
    triggerId: string,
    trigger: CreateTriggerInterface
  ) {
    return this.#http.put<TriggerInterface>(
      `${environment.apiUrl}/apps/${appId}/triggers/${triggerId}`,
      trigger
    );
  }

  deleteTrigger(appId: string, triggerId: string) {
    return this.#http.delete<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/triggers/${triggerId}`
    );
  }
}
