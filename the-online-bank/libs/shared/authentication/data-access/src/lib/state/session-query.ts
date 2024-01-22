import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { filter, map } from 'rxjs';

import { SessionState } from '../model/session-state';
import { SessionStore } from './session-store';

@Injectable({ providedIn: 'root' })
export class SessionQuery extends Query<SessionState> {
  readonly bearerToken$ = this.select('bearerToken');

  readonly isLoggedIn$ = this.select('bearerToken').pipe(map(Boolean));

  readonly name$ = this.select('tokenClaims').pipe(
    filter(Boolean),
    map(({ name }) => name)
  );

  constructor(protected override store: SessionStore) {
    super(store);
  }
}
