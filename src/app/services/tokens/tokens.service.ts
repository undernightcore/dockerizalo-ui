import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MessageInterface } from '../../interfaces/message.interface';
import { TokenInterface } from '../../interfaces/token.interface';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  #http = inject(HttpClient);

  getTokens() {
    return this.#http.get<TokenInterface[]>(`${environment.apiUrl}/tokens`);
  }

  createToken(token: Omit<TokenInterface, 'id'>) {
    return this.#http.post<TokenInterface>(
      `${environment.apiUrl}/tokens`,
      token
    );
  }

  updateToken(id: string, token: Omit<TokenInterface, 'id'>) {
    return this.#http.put<TokenInterface>(
      `${environment.apiUrl}/tokens/${id}`,
      token
    );
  }

  deleteToken(id: string) {
    return this.#http.delete<MessageInterface>(
      `${environment.apiUrl}/tokens/${id}`
    );
  }
}
