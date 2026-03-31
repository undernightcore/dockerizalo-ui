import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequestInterface,
  RegisterRequestInterface,
  TokenInterface,
  UserInterface,
} from '../../interfaces/auth.interface';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);

  #token = new BehaviorSubject<string | undefined>(
    localStorage.getItem('token') || undefined
  );
  token$ = this.#token.asObservable();

  #reloadUser = new Subject<void>();
  user$ = this.#reloadUser.pipe(
    startWith(true),
    switchMap(() => this.getUser()),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  registerUser(user: RegisterRequestInterface) {
    return this.#http
      .post<TokenInterface>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        tap(({ token }) => {
          this.saveToken(token);
        })
      );
  }

  loginUser(user: LoginRequestInterface) {
    return this.#http
      .post<TokenInterface>(`${environment.apiUrl}/auth/login`, user)
      .pipe(
        tap(({ token }) => {
          this.saveToken(token);
        })
      );
  }

  getUser() {
    return this.#http.get<UserInterface>(`${environment.apiUrl}/auth/me`);
  }

  getUsers() {
    return this.#http.get<UserInterface[]>(`${environment.apiUrl}/auth/users`);
  }

  createUser(user: RegisterRequestInterface) {
    return this.#http.post<TokenInterface>(
      `${environment.apiUrl}/auth/register`,
      user
    );
  }

  editUser(id: number, user: Partial<RegisterRequestInterface>) {
    return this.#http
      .put<UserInterface>(`${environment.apiUrl}/auth/users/${id}`, user)
      .pipe(tap(() => this.#reloadUser.next()));
  }

  deleteUser(id: number) {
    return this.#http.delete<MessageInterface>(
      `${environment.apiUrl}/auth/users/${id}`
    );
  }

  saveToken(token: string) {
    this.#token.next(token);
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.removeItem('token');
    this.#token.next(undefined);
  }
}
