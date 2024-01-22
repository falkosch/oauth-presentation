import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { filter, map, of, switchMap } from 'rxjs';

import { SessionQuery } from '@the-online-bank/shared-authentication-data-access';

import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationFilterService } from '../services/authentication-filter.service';

export const addBearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationFilterService = inject(AuthenticationFilterService);

  if (authenticationFilterService.isUnprotected(req.url)) {
    return next(req);
  }
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const authenticationService = inject(AuthenticationService);
  const sessionQuery = inject(SessionQuery);

  const awaitBearerToken$ = sessionQuery.bearerToken$.pipe(
    switchMap((bearerToken) => {
      if (bearerToken) {
        return of(bearerToken);
      }
      return authenticationService.login().pipe(
        switchMap(() => sessionQuery.bearerToken$),
        filter(Boolean)
      );
    })
  );

  return awaitBearerToken$.pipe(
    map((bearerToken) => ({ Authorization: `Bearer ${bearerToken}` })),
    map((headersToAppend) => req.clone({ setHeaders: headersToAppend })),
    switchMap((authorizedRequest) => next(authorizedRequest))
  );
};
