import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { KeycloakApiService } from '../infrastructure/keycloak-api.service';
import { AccessToken } from '../model/access-token';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  constructor(private readonly keycloakApiService: KeycloakApiService) {}

  initialize(): Observable<AccessToken | null> {
    return this.keycloakApiService.initialize();
  }

  login(returnUrl?: string): Observable<AccessToken> {
    return this.keycloakApiService.login(returnUrl);
  }

  logout(): Observable<void> {
    return this.keycloakApiService.logout();
  }
}
