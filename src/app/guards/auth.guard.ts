import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.token$.pipe(
    map((token) => Boolean(token) || router.createUrlTree(['/login']))
  );
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => user?.role === 'ADMIN' || router.createUrlTree(['/']))
  );
};

export const nonAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.token$.pipe(
    map((token) => !token || router.createUrlTree(['/']))
  );
};
