import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { of, ReplaySubject, Subject } from 'rxjs';

import { SessionQuery } from '@the-online-bank/shared-authentication-data-access';

import { AuthenticationService } from '../services/authentication.service';
import { authenticatedGuard } from './authenticated.guard';

@Component({ template: 'test' })
class TestComponent {}

describe('authenticatedGuard', () => {
  let authenticationServiceMock: AuthenticationService;

  let routerHarness: RouterTestingHarness;
  let isLoggedIn$: Subject<boolean>;

  beforeEach(() => {
    isLoggedIn$ = new ReplaySubject(1);

    return MockBuilder()
      .provide(
        provideRouter([
          {
            path: 'foobar',
            canActivate: [authenticatedGuard],
            component: TestComponent,
          },
        ])
      )
      .keep(RouterTestingModule.withRoutes([]))
      .mock(SessionQuery, { isLoggedIn$ })
      .mock(AuthenticationService, {
        login: jest.fn().mockReturnValue(of(true)),
      });
  });

  beforeEach(async () => {
    routerHarness = await RouterTestingHarness.create();
    authenticationServiceMock = ngMocks.get(AuthenticationService);
  });

  it('should passthrough when user is logged in', async () => {
    isLoggedIn$.next(true);

    await routerHarness.navigateByUrl('foobar');

    expect(authenticationServiceMock.login).toHaveBeenCalledTimes(0);
  });

  describe('when user is not logged in', () => {
    it('should trigger login with return url', async () => {
      isLoggedIn$.next(false);

      await routerHarness.navigateByUrl('foobar');

      expect(authenticationServiceMock.login).toHaveBeenCalledWith('http://localhost//foobar');
      expect(authenticationServiceMock.login).toHaveBeenCalledTimes(1);
    });
  });
});
