import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { EMPTY, NEVER, of } from 'rxjs';

import { runInTestScheduler } from '@the-online-bank/shared-util/testing';

import { KeycloakApiService } from '../infrastructure/keycloak-api.service';
import { AccessToken } from '../model/access-token';
import { KeycloakService } from './keycloak.service';

describe('KeycloakService', () => {
  const givenAccessToken: AccessToken = {
    encoded: 'test-encoded',
    claims: { sub: 'test-sub' },
  };

  let keycloakApiServiceMock: KeycloakApiService;
  let service: KeycloakService;

  beforeEach(() => MockBuilder(KeycloakService));

  beforeEach(() => {
    MockRender(KeycloakService);
    keycloakApiServiceMock = ngMocks.get(KeycloakApiService);
    service = ngMocks.get(KeycloakService);
  });

  describe('.initialize()', () => {
    it('should initialize api and emit initial access token', () => {
      jest.spyOn(keycloakApiServiceMock, 'initialize').mockReturnValue(of(givenAccessToken));

      runInTestScheduler(({ expectObservable }) => {
        expectObservable(service.initialize()).toBe('(x|)', {
          x: givenAccessToken,
        });
      });

      expect(keycloakApiServiceMock.initialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('.login()', () => {
    it('should login via api and emit fetched access token', () => {
      jest.spyOn(keycloakApiServiceMock, 'login').mockReturnValue(of(givenAccessToken));

      runInTestScheduler(({ expectObservable }) => {
        expectObservable(service.login()).toBe('(x|)', {
          x: givenAccessToken,
        });
      });

      expect(keycloakApiServiceMock.login).toHaveBeenCalledTimes(1);
    });

    it('should pass returnUrl to api', () => {
      jest.spyOn(keycloakApiServiceMock, 'login').mockReturnValue(NEVER);

      service.login('/test/return/url');

      expect(keycloakApiServiceMock.login).toHaveBeenCalledWith('/test/return/url');
    });
  });

  describe('.logout()', () => {
    it('should logout via api', () => {
      jest.spyOn(keycloakApiServiceMock, 'logout').mockReturnValue(EMPTY);

      runInTestScheduler(({ expectObservable }) => {
        expectObservable(service.logout()).toBe('|');
      });

      expect(keycloakApiServiceMock.logout).toHaveBeenCalledTimes(1);
    });
  });
});
