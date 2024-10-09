import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { defer, map, Observable } from 'rxjs';

import { AccessToken } from '../model/access-token';

@Injectable({ providedIn: 'root' })
export class KeycloakApiService {
  private keycloak = new Keycloak({
    clientId: 'the-online-bank',
    realm: 'customer',
    url: 'http://localhost:8080/',
  });

  initialize(): Observable<AccessToken | null> {
    return defer(() =>
      this.keycloak
        .init({
          redirectUri: 'http://localhost:4200/',
          onLoad: 'check-sso',
          pkceMethod: 'S256',
        })
        .catch((e: unknown) => {
          console.error('failed to init keycloak sdk', e);
          throw new Error('failed to init keycloak sdk', { cause: e });
        })
    ).pipe(map(() => this.getAccessTokenOrNull()));
  }

  private getAccessTokenOrNull(): AccessToken | null {
    if (this.keycloak.token && this.keycloak.tokenParsed) {
      return {
        encoded: this.keycloak.token,
        claims: this.keycloak.tokenParsed,
      };
    }
    return null;
  }

  login(redirectUri?: string): Observable<AccessToken> {
    return defer(() =>
      this.keycloak.login({
        redirectUri,
      })
    ).pipe(map(() => this.getAccessToken()));
  }

  private getAccessToken(): AccessToken {
    const token = this.getAccessTokenOrNull();
    if (token) {
      return token;
    }
    throw new Error('failed to get access token');
  }

  logout(): Observable<void> {
    return defer(() => this.keycloak.logout());
  }
}
