import { DOCUMENT, Location } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';

import { SessionQuery } from '@the-online-bank/shared-authentication-data-access';

import { AuthenticationService } from '../services/authentication.service';

export const authenticatedGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authenticationService = inject(AuthenticationService);

  const baseUrl = inject(DOCUMENT).baseURI;
  const routeRelativeUrl = inject(Location).prepareExternalUrl(state.url);

  return inject(SessionQuery).isLoggedIn$.pipe(
    switchMap((isLoggedIn) => {
      if (isLoggedIn) {
        return of(true);
      }

      return authenticationService.login(`${baseUrl}${routeRelativeUrl}`);
    })
  );
};
