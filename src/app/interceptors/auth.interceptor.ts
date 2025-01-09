import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import {
  catchError,
  filter,
  map,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.token$.pipe(
    take(1),
    map((token) =>
      req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    ),
    switchMap((request) => next(request)),
    catchError((error) => {
      if (error.status === 401) {
        authService.clearToken();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
