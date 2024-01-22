import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { SessionState } from '../model/session-state';
import { TokenClaims } from '../model/token-claims';
import { createInitialSessionState } from './create-initial-session-state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
  constructor() {
    super(createInitialSessionState());
  }

  setBearerTokenAndTokenClaims(bearerToken: string, tokenClaims: TokenClaims) {
    this.update({ bearerToken, tokenClaims });
  }
}
