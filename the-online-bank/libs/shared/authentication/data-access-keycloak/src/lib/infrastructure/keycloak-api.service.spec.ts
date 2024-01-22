import Keycloak from 'keycloak-js';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { firstValueFrom } from 'rxjs';

import { AccessToken } from '../model/access-token';
import { KeycloakApiService } from './keycloak-api.service';

jest.mock('keycloak-js');

describe('KeycloakApiService', () => {
  const givenAccessToken: AccessToken = {
    encoded: 'test-encoded',
    claims: { sub: 'test-sub' },
  };

  let keycloakMock: Keycloak;
  let service: KeycloakApiService;

  beforeEach(() => {
    (Keycloak as jest.Mock).mockImplementation(() => ({
      init: jest.fn().mockResolvedValue(true),
      login: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined),
      token: givenAccessToken.encoded,
      tokenParsed: givenAccessToken.claims,
    }));
  });

  beforeEach(() => MockBuilder(KeycloakApiService));

  beforeEach(() => {
    MockRender(KeycloakApiService);
    service = ngMocks.get(KeycloakApiService);
    keycloakMock = service['keycloak'];
  });

  describe('.initialize()', () => {
    it('should initialize with default redirect uri', async () => {
      await firstValueFrom(service.initialize());

      expect(keycloakMock.init).toHaveBeenCalledWith({
        redirectUri: 'http://localhost:4200/',
      });
      expect(keycloakMock.init).toHaveBeenCalledTimes(1);
    });

    it('should emit initial access token when available', async () => {
      await expect(firstValueFrom(service.initialize())).resolves.toEqual(givenAccessToken);
    });

    it('should not emit initial access token when non available', async () => {
      keycloakMock.token = undefined;
      keycloakMock.tokenParsed = undefined;

      await expect(firstValueFrom(service.initialize())).resolves.toBeNull();
    });
  });

  describe('.login()', () => {
    it.each([undefined, '/test'])(
      'should login with given redirect uri %s',
      async (givenRedirectUri) => {
        await firstValueFrom(service.login(givenRedirectUri));

        expect(keycloakMock.login).toHaveBeenCalledWith({
          redirectUri: givenRedirectUri,
        });
        expect(keycloakMock.login).toHaveBeenCalledTimes(1);
      }
    );

    it('should emit access token when available', async () => {
      await expect(firstValueFrom(service.login())).resolves.toEqual(givenAccessToken);
    });

    it('should throw when access token is not available', async () => {
      keycloakMock.token = undefined;
      keycloakMock.tokenParsed = undefined;

      await expect(firstValueFrom(service.login())).rejects.toThrow(
        new Error('failed to get access token')
      );
    });
  });

  describe('.logout()', () => {
    it('should logout via keycloak', async () => {
      await firstValueFrom(service.logout());

      expect(keycloakMock.logout).toHaveBeenCalledTimes(1);
    });
  });
});
