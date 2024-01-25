import { HttpErrorResponse, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { runInTestScheduler } from '@the-online-bank/shared-util/testing';

import { AuthenticationService } from '../services/authentication.service';
import { logoutOnApiAuthenticationErrorInterceptor } from './logout-on-api-authentication-error.interceptor';

describe('logoutOnApiAuthenticationErrorInterceptor', () => {
  const givenResponse = { type: HttpEventType.Sent };

  const expectedLogoutError = (cause: unknown) =>
    new Error('logout due to api authentication error', { cause });

  const nextMock = jest.fn();

  let authenticationServiceMock: AuthenticationService;
  let requestMock: HttpRequest<unknown>;

  beforeEach(() =>
    MockBuilder()
      .mock(AuthenticationService, {
        logout: jest.fn().mockReturnValue(of(undefined)),
      })
      .mock(HttpRequest)
  );

  beforeEach(() => {
    authenticationServiceMock = ngMocks.get(AuthenticationService);
    requestMock = ngMocks.get(HttpRequest);
  });

  const invokeInterceptor = () =>
    runInInjectionContext(ngMocks.get(Injector), () =>
      logoutOnApiAuthenticationErrorInterceptor(requestMock, nextMock)
    );

  it('should pass request to the next function', () => {
    nextMock.mockReturnValue(of(givenResponse));

    invokeInterceptor();

    expect(nextMock).toHaveBeenCalledWith(requestMock);
    expect(nextMock).toHaveBeenCalledTimes(1);
  });

  it('should passthrough non-errors', () => {
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
