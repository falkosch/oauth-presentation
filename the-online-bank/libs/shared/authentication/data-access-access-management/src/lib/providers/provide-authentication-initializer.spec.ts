import { MockBuilder, ngMocks } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import {
  AccessToken,
  KeycloakService,
} from '@the-online-bank/shared-authentication-data-access-keycloak';

import { AccessTokenService } from '../services/access-token.service';
import { provideAuthenticationInitializer } from './provide-authentication-initializer';

describe('provideAuthenticationInitializer', () => {
  let accessTokenServiceMock: AccessTokenService;
  let keycloakServiceMock: KeycloakService;

  beforeEach(() => {
    jest.spyOn(console, 'error');
  });

  describe('when access token is available', () => {
    const givenAccessToken: AccessToken = {
      encoded: 'test-encoded',
      claims: { sub: 'test-subject' },
    };

    beforeEach(() =>
      MockBuilder()
        .provide(provideAuthenticationInitializer())
        .mock(KeycloakService, {
          initialize: jest.fn().mockReturnValue(of(givenAccessToken)),
        })
    );

    beforeEach(() => {
      accessTokenServiceMock = ngMocks.get(AccessTokenService);
      keycloakServiceMock = ngMocks.get(KeycloakService);
    });

    it('should initialize keycloak', () => {
      expect(keycloakServiceMock.initialize).toHaveBeenCalledTimes(1);
    });

    it('should consume given access token', () => {
      expect(accessTokenServiceMock.consume).toHaveBeenCalledWith(givenAccessToken);
      expect(accessTokenServiceMock.consume).toHaveBeenCalledTimes(1);
    });

    it('should not log errors', () => {
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('when access token is null', () => {
    beforeEach(() =>
      MockBuilder()
        .provide(provideAuthenticationInitializer())
        .mock(KeycloakService, {
          initialize: jest.fn().mockReturnValue(of(null)),
        })
    );

    beforeEach(() => {
      accessTokenServiceMock = ngMocks.get(AccessTokenService);
      keycloakServiceMock = ngMocks.get(KeycloakService);
    });

    it('should initialize keycloak', () => {
      expect(keycloakServiceMock.initialize).toHaveBeenCalledTimes(1);
    });

    it('should not consume null access token', () => {
      expect(accessTokenServiceMock.consume).toHaveBeenCalledTimes(0);
    });

    it('should not log errors', () => {
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('when initialization emits an error', () => {
    beforeEach(() =>
      MockBuilder()
        .provide(provideAuthenticationInitializer())
        .mock(KeycloakService, {
          initialize: jest.fn().mockReturnValue(throwError(() => new Error('test'))),
        })
    );

    beforeEach(() => {
      accessTokenServiceMock = ngMocks.get(AccessTokenService);
      keycloakServiceMock = ngMocks.get(KeycloakService);
    });

    it('should initialize keycloak', () => {
      expect(keycloakServiceMock.initialize).toHaveBeenCalledTimes(1);
    });

    it('should not consume null access token', () => {
      expect(accessTokenServiceMock.consume).toHaveBeenCalledTimes(0);
    });

    it('should log thrown error', () => {
      expect(console.error).toHaveBeenCalledWith(new Error('test'));
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
