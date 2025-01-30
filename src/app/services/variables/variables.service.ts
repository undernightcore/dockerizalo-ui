import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VariableInterface } from '../../interfaces/variable.interface';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  #http = inject(HttpClient);

  getVariables(appId: string) {
    return this.#http.get<VariableInterface[]>(
      `${environment.apiUrl}/apps/${appId}/variables`
    );
  }

  saveVariables(
    appId: string,
    variables: Omit<VariableInterface, 'id' | 'appId'>[]
  ) {
    return this.#http.patch<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/variables`,
      variables
    );
  }
}
