import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { AuthenticationFilterService } from './authentication-filter.service';

describe('AuthenticationFilterService', () => {
  const givenProtectedUrls = [
    'http://localhost:8080/realms/customer/account',
    'http://localhost:8080/realms/customer/account/',
    'http://localhost:8080/realms/customer/account/foobar',
  ];
  const givenUnprotectedUrls = [
    'http://localhost:4200',
    'http://localhost:4200/',
    'http://localhost:4200/foobar',
  ];

  let service: AuthenticationFilterService;

  beforeEach(() => MockBuilder(AuthenticationFilterService));

  beforeEach(() => {
    MockRender(AuthenticationFilterService);
    service = ngMocks.get(AuthenticationFilterService);
  });

  describe('.isProtected()', () => {
    it.each(givenProtectedUrls)('should return true for protected url %s', (givenProtectedUrl) => {
      expect(service.isProtected(givenProtectedUrl)).toEqual(true);
    });

    it.each(givenUnprotectedUrls)(
      'should return false for unprotected url %s',
      (givenUnprotectedUrl) => {
        expect(service.isProtected(givenUnprotectedUrl)).toEqual(false);
      }
    );
  });

  describe('.isUnprotected()', () => {
    it.each(givenProtectedUrls)(
      'should return false for given protected url %s',
      (givenProtectedUrl) => {
        expect(service.isUnprotected(givenProtectedUrl)).toEqual(false);
      }
    );

    it.each(givenUnprotectedUrls)(
      'should return true for given unprotected url %s',
      (givenUnprotectedUrl) => {
        expect(service.isUnprotected(givenUnprotectedUrl)).toEqual(true);
      }
    );
  });
});
