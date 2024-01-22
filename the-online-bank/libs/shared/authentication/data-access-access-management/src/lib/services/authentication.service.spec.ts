import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';

import {
  AccessToken,
  KeycloakService,
} from '@the-online-bank/shared-authentication-data-access-keycloak';
import { runInTestScheduler } from '@the-online-bank/shared-util/testing';

import { AccessTokenService } from './access-token.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  const givenAccessToken: AccessToken = {
    encoded: 'test',
    claims: { sub: 'test-sub' },
  };

  let keycloakServiceMock: KeycloakService;
  let accessTokenServiceMock: AccessTokenService;
  let service: AuthenticationService;

  beforeEach(() =>
    MockBuilder(AuthenticationService)
      .mock(KeycloakService, {
        login: jest.fn().mockReturnValue(of(givenAccessToken)),
        logout: jest.fn().mockReturnValue(EMPTY),
      })
      .mock(AccessTokenService, {
        consume: jest.fn(),
      })
  );

  beforeEach(() => {
    MockRender(AuthenticationService);
    keycloakServiceMock = ngMocks.get(KeycloakService);
    accessTokenServiceMock = ngMocks.get(AccessTokenService);
    service = ngMocks.get(AuthenticationService);
  });

  describe('.login()', () => {
    it.each([undefined, ''])('should login via keycloak with returnUrl %s', (givenReturnUrl) => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(service.login(givenReturnUrl)).toBe('(x|)', {
          x: true,
        });
      });

      expect(keycloakServiceMock.login).toHaveBeenCalledWith(givenReturnUrl);
      expect(keycloakServiceMock.login).toHaveBeenCalledTimes(1);

      expect(accessTokenServiceMock.consume).toHaveBeenCalledWith(givenAccessToken);
      expect(accessTokenServiceMock.consume).toHaveBeenCalledTimes(1);
    });

    it('should consume fetched access token', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(service.login());
      });

      expect(accessTokenServiceMock.consume).toHaveBeenCalledWith(givenAccessToken);
      expect(accessTokenServiceMock.consume).toHaveBeenCalledTimes(1);
    });
  });

  describe('.logout()', () => {
    it('should logout via keycloak', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(service.logout()).toBe('|');
      });

      expect(keycloakServiceMock.logout).toHaveBeenCalledTimes(1);
    });
  });
});
