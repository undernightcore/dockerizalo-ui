import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(MessageService);

  return next(req).pipe(
    catchError((error) => {
      if (error.error.message) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      }

      return throwError(() => error);
    })
  );
};
