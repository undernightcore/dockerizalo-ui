import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { filter, map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.token$.pipe(
    map((token) =>
      req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    ),
    switchMap((request) => next(request)),
    filter(
      (event) => event.type === HttpEventType.Response && event.status === 401
    ),
    tap(() => {
      authService.clearToken();
      router.navigate(['/login']);
    })
  );
};
