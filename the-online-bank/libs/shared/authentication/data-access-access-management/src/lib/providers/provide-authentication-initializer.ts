import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { catchError, EMPTY, filter, switchMap, tap } from 'rxjs';

import { KeycloakService } from '@the-online-bank/shared-authentication-data-access-keycloak';

import { AccessTokenService } from '../services/access-token.service';

export const provideAuthenticationInitializer = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  multi: true,
  deps: [KeycloakService, AccessTokenService],
  useFactory: (keycloakService: KeycloakService, accessTokenService: AccessTokenService) => () => {
    return keycloakService.initialize().pipe(
      filter(Boolean),
      tap((accessToken) => accessTokenService.consume(accessToken)),
      switchMap(() => EMPTY),
      catchError(() => EMPTY)
    );
  },
});
