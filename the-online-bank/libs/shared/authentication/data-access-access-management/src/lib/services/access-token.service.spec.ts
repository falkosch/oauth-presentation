import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { SessionStore } from '@the-online-bank/shared-authentication-data-access';
import { AccessToken } from '@the-online-bank/shared-authentication-data-access-keycloak';

import { AccessTokenService } from './access-token.service';

describe('AccessTokenService', () => {
  const givenAccessToken: AccessToken = {
    encoded: 'test',
    claims: {
      sub: 'test-subject',
      name: 'test-name',
    },
  };

  let sessionStoreMock: SessionStore;
  let service: AccessTokenService;

  beforeEach(() =>
    MockBuilder(AccessTokenService).mock(SessionStore, {
      setBearerTokenAndTokenClaims: jest.fn(),
    })
  );

  beforeEach(() => {
    MockRender(AccessTokenService);
    sessionStoreMock = ngMocks.get(SessionStore);
    service = ngMocks.get(AccessTokenService);
  });

  describe('.consume()', () => {
    it('should set bearer token and token claims in session store', () => {
      service.consume(givenAccessToken);

      expect(sessionStoreMock.setBearerTokenAndTokenClaims).toHaveBeenCalledWith(
        givenAccessToken.encoded,
        {
          sub: givenAccessToken.claims.sub,
          name: givenAccessToken.claims['name'],
        }
      );
      expect(sessionStoreMock.setBearerTokenAndTokenClaims).toHaveBeenCalledTimes(1);
    });

    it('should default name to null when name in claims is missing', () => {
      service.consume({
        encoded: givenAccessToken.encoded,
        claims: {
          sub: givenAccessToken.claims.sub,
        },
      });

      expect(sessionStoreMock.setBearerTokenAndTokenClaims).toHaveBeenCalledWith(
        givenAccessToken.encoded,
        {
          sub: givenAccessToken.claims.sub,
          name: null,
        }
      );
    });

    it('should not update store but throw when sub in claims is missing', () => {
      expect(() =>
        service.consume({
          encoded: givenAccessToken.encoded,
          claims: {},
        })
      ).toThrow(new Error('missing sub in claims'));

      expect(sessionStoreMock.setBearerTokenAndTokenClaims).toHaveBeenCalledTimes(0);
    });
  });
});
