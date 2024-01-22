import { Injectable } from '@angular/core';

import { SessionStore, TokenClaims } from '@the-online-bank/shared-authentication-data-access';
import { AccessToken } from '@the-online-bank/shared-authentication-data-access-keycloak';

@Injectable({ providedIn: 'root' })
export class AccessTokenService {
  constructor(private readonly sessionStore: SessionStore) {}

  consume(accessToken: AccessToken): void {
    this.sessionStore.setBearerTokenAndTokenClaims(
      accessToken.encoded,
      this.toTokenClaims(accessToken)
    );
  }

  private toTokenClaims({ claims }: AccessToken): TokenClaims {
    if (!claims.sub) {
      throw new Error('missing sub in claims');
    }

    return {
      sub: claims.sub,
      name: claims['name'] ?? null,
    };
  }
}
