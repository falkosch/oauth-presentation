import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { KeycloakService } from '@the-online-bank/shared-authentication-data-access-keycloak';

import { AccessTokenService } from './access-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly accessTokenService: AccessTokenService
  ) {}

  login(returnUrl?: string): Observable<boolean> {
    return this.keycloakService.login(returnUrl).pipe(
      tap((accessToken) => this.accessTokenService.consume(accessToken)),
      map(() => true)
    );
  }

  logout(): Observable<void> {
    return this.keycloakService.logout();
  }
}
