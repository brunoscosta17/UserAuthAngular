import {
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;

  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return from(auth.refreshToken()).pipe(
          switchMap((refreshed) => {
            if (refreshed) {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${auth.token}`
                }
              });
              return next(retryReq);
            }
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
