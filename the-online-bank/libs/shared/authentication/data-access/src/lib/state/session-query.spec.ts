import { MockBuilder, ngMocks } from 'ng-mocks';

import { runInTestScheduler } from '@the-online-bank/shared-util/testing';

import { TokenClaims } from '../model/token-claims';
import { SessionQuery } from './session-query';
import { SessionStore } from './session-store';

describe('SessionQuery', () => {
  const givenBearerToken = 'test-bearer-token';
  const givenTokenClaims: TokenClaims = {
    sub: 'test-sub',
    name: 'test-name',
  };

  let query: SessionQuery;
  let store: SessionStore;

  beforeEach(async () => {
    await MockBuilder();
    query = ngMocks.get(SessionQuery);
    store = ngMocks.get(SessionStore);
  });

  it('should have initial state', () => {
    expect(query.getValue()).toEqual({
      bearerToken: null,
      tokenClaims: null,
    });
  });

  describe('bearerToken$', () => {
    it('should initially emit null', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(query.bearerToken$).toBe('x', {
          x: null,
        });
      });
    });

    it('should emit bearer token', () => {
      runInTestScheduler(({ expectObservable }) => {
        store.setBearerTokenAndTokenClaims(givenBearerToken, givenTokenClaims);

        expectObservable(query.bearerToken$).toBe('x', {
          x: givenBearerToken,
        });
      });
    });
  });

  describe('isLoggedIn$', () => {
    it('should initially emit false', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(query.isLoggedIn$).toBe('x', {
          x: false,
        });
      });
    });

    it('should emit false when bearerToken is empty', () => {
      runInTestScheduler(({ expectObservable }) => {
        store.setBearerTokenAndTokenClaims('', givenTokenClaims);

        expectObservable(query.isLoggedIn$).toBe('x', {
          x: false,
        });
      });
    });

    it('should emit true when bearerToken is non-empty', () => {
      runInTestScheduler(({ expectObservable }) => {
        store.setBearerTokenAndTokenClaims(givenBearerToken, givenTokenClaims);

        expectObservable(query.isLoggedIn$).toBe('x', {
          x: true,
        });
      });
    });
  });

  describe('name$', () => {
    it('should initially not emit or when token claims are null', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(query.name$).toBe('-');
      });
    });

    it('should emit name from token claims when token claims are set', () => {
      runInTestScheduler(({ expectObservable }) => {
        store.setBearerTokenAndTokenClaims(givenBearerToken, givenTokenClaims);

        expectObservable(query.name$).toBe('x', {
          x: givenTokenClaims.name,
        });
      });
    });
  });
});
