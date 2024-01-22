import { MockBuilder, ngMocks } from 'ng-mocks';

import { TokenClaims } from '../model/token-claims';
import { SessionStore } from './session-store';

describe('SessionStore', () => {
  const givenBearerToken = 'test-bearer-token';
  const givenTokenClaims: TokenClaims = {
    sub: 'test-sub',
    name: 'test-name',
  };

  let store: SessionStore;

  beforeEach(async () => {
    await MockBuilder();
    store = ngMocks.get(SessionStore);
    jest.spyOn(store, 'update');
  });

  describe('setBearerTokenAndTokenClaims', () => {
    it('should update bearer token and token claims', () => {
      store.setBearerTokenAndTokenClaims(givenBearerToken, givenTokenClaims);

      expect(store.update).toHaveBeenCalledWith({
        bearerToken: givenBearerToken,
        tokenClaims: givenTokenClaims,
      });
      expect(store.update).toHaveBeenCalledTimes(1);
    });
  });
});
