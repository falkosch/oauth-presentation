import { HttpErrorResponse, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { NEVER, of, ReplaySubject, Subject, throwError } from 'rxjs';

import { SessionQuery } from '@the-online-bank/shared-authentication-data-access';
import { runInTestScheduler } from '@the-online-bank/shared-util/testing';

import { AuthenticationService } from '../services/authentication.service';
import { logoutOnApiAuthenticationErrorInterceptor } from './logout-on-api-authentication-error.interceptor';

describe('logoutOnApiAuthenticationErrorInterceptor', () => {
  const expectedLogoutError = (cause: unknown) =>
    new Error('logout due to api authentication error', { cause });

  const nextMock = jest.fn();

  let authenticationServiceMock: AuthenticationService;
  let requestMock: HttpRequest<unknown>;

  let isLoggedIn$: Subject<boolean>;

  beforeEach(() => {
    isLoggedIn$ = new ReplaySubject(1);

    return MockBuilder()
      .mock(HttpRequest)
      .mock(SessionQuery, {
        isLoggedIn$,
      })
      .mock(AuthenticationService, {
        logout: jest.fn().mockReturnValue(of(undefined)),
      });
  });

  beforeEach(async () => {
    authenticationServiceMock = ngMocks.get(AuthenticationService);
    requestMock = ngMocks.get(HttpRequest);
  });

  const invokeInterceptor = () =>
    runInInjectionContext(ngMocks.get(Injector), () =>
      logoutOnApiAuthenticationErrorInterceptor(requestMock, nextMock)
    );

  it('should pass request to the next function', () => {
    nextMock.mockReturnValue(NEVER);

    invokeInterceptor();

    expect(nextMock).toHaveBeenCalledWith(requestMock);
    expect(nextMock).toHaveBeenCalledTimes(1);
  });

  it('should passthrough non-errors', () => {
    const givenResponse = { type: HttpEventType.Sent };
    nextMock.mockReturnValue(of(givenResponse));

    runInTestScheduler(({ expectObservable }) => {
      expectObservable(invokeInterceptor()).toBe('(x|)', {
        x: givenResponse,
      });
    });
  });

  it('should trigger logout and throw new error with error response as cause when request fails with status 0', () => {
    const givenError = new HttpErrorResponse({ status: 0 });
    nextMock.mockReturnValue(throwError(() => givenError));

    runInTestScheduler(({ expectObservable }) => {
      expectObservable(invokeInterceptor()).toBe('#', {}, expectedLogoutError(givenError));
    });

    expect(authenticationServiceMock.logout).toHaveBeenCalledTimes(1);
  });

  it('should trigger logout and throw new error with error response as cause when request fails with status 401', () => {
    const givenError = new HttpErrorResponse({ status: 401 });
    nextMock.mockReturnValue(throwError(() => givenError));

    runInTestScheduler(({ expectObservable }) => {
      expectObservable(invokeInterceptor()).toBe('#', {}, expectedLogoutError(givenError));
    });

    expect(authenticationServiceMock.logout).toHaveBeenCalledTimes(1);
  });

  it('should not logout but just passthrough error response when request fails with any other status codes', () => {
    const givenError = new HttpErrorResponse({ status: 403 });
    nextMock.mockReturnValue(throwError(() => givenError));

    runInTestScheduler(({ expectObservable }) => {
      expectObservable(invokeInterceptor()).toBe('#', {}, givenError);
    });

    expect(authenticationServiceMock.logout).toHaveBeenCalledTimes(0);
  });
});
