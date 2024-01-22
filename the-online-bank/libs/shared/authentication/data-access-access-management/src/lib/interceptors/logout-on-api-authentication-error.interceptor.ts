import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

const authenticationCodes = [0, 401];

export const logoutOnApiAuthenticationErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        authenticationCodes.some((code) => code === error.status)
      ) {
        return authenticationService.logout().pipe(
          switchMap(() =>
            throwError(
              () =>
                new Error('logout due to api authentication error', {
                  cause: error,
                })
            )
          )
        );
      }
      throw error;
    })
  );
};
