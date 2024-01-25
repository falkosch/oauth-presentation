import { HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';
import { MockBuilder, MockService, ngMocks } from 'ng-mocks';
import { BehaviorSubject, of, Subject } from 'rxjs';

import { SessionQuery } from '@the-online-bank/shared-authentication-data-access';
import { runInTestScheduler } from '@the-online-bank/shared-util/testing';

import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationFilterService } from '../services/authentication-filter.service';
import { addBearerTokenInterceptor } from './add-bearer-token.interceptor';

describe('addBearerTokenInterceptor', () => {
  const givenResponse = { type: HttpEventType.Sent };
  const givenBearerToken = 'test-bearer-token';
  const givenRequestClone = MockService(HttpRequest);

  const nextMock = jest.fn();

  let authenticationFilterServiceMock: AuthenticationFilterService;
  let authenticationServiceMock: AuthenticationService;
  let requestMock: HttpRequest<unknown>;
  let bearerToken$Mock: Subject<string | null>;

  beforeEach(() => {
    nextMock.mockReturnValue(of(givenResponse));

    bearerToken$Mock = new BehaviorSubject<string | null>(null);

    return MockBuilder()
      .mock(AuthenticationFilterService, {
        isUnprotected: jest.fn().mockReturnValue(false),
      })
      .mock(AuthenticationService, {
        logout: jest.fn().mockReturnValue(of(undefined)),
      })
      .mock(HttpRequest, {
        clone: jest.fn().mockReturnValue(givenRequestClone),
        headers: MockService(HttpHeaders, {
          has: jest.fn().mockReturnValue(false),
        }),
      })
      .mock(SessionQuery, {
        bearerToken$: bearerToken$Mock,
      });
  });

  beforeEach(() => {
    authenticationFilterServiceMock = ngMocks.get(AuthenticationFilterService);
    authenticationServiceMock = ngMocks.get(AuthenticationService);
    requestMock = ngMocks.get(HttpRequest);
  });

  const invokeInterceptor = () =>
    runInInjectionContext(ngMocks.get(Injector), () =>
      addBearerTokenInterceptor(requestMock, nextMock)
    );

  it('should passthrough request and response when url is to unprotected API', () => {
    jest.spyOn(authenticationFilterServiceMock, 'isUnprotected').mockReturnValue(true);

    runInTestScheduler(({ expectObservable }) => {
      expectObservable(invokeInterceptor()).toBe('(x|)', {
        x: givenResponse,
      });
    });

    expect(nextMock).toHaveBeenCalledWith(requestMock);
    expect(nextMock).toHaveBeenCalledTimes(1);

    expect(authenticationServiceMock.login).toHaveBeenCalledTimes(0);
    expect(requestMock.clone).toHaveBeenCalledTimes(0);
    expect(requestMock.headers.has).toHaveBeenCalledTimes(0);
  });

  it('should passthrough request and response when request has Authorization header', () => {
    jest.spyOn(requestMock.headers, 'has').mockReturnValue(true);

    runInTestScheduler(({ expectObservable }) => {
      expectObservable(invokeInterceptor()).toBe('(x|)', {
        x: givenResponse,
      });
    });

    expect(nextMock).toHaveBeenCalledWith(requestMock);
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(requestMock.headers.has).toHaveBeenCalledWith('Authorization');
    expect(requestMock.headers.has).toHaveBeenCalledTimes(1);

    expect(authenticationServiceMock.login).toHaveBeenCalledTimes(0);
    expect(requestMock.clone).toHaveBeenCalledTimes(0);
  });

  describe('when bearer token is available', () => {
    beforeEach(() => {
      bearerToken$Mock.next(givenBearerToken);
    });

    it('should not trigger login', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(invokeInterceptor());
      });

      expect(authenticationServiceMock.login).toHaveBeenCalledTimes(0);
    });

    it('should pass request clone having bearer token set in Authorization header', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(invokeInterceptor()).toBe('(x|)', {
          x: givenResponse,
        });
      });

      expect(requestMock.clone).toHaveBeenCalledWith({
        setHeaders: {
          Authorization: `Bearer ${givenBearerToken}`,
        },
      });
      expect(requestMock.clone).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(givenRequestClone);
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when bearer token is not available but session is active', () => {
    beforeEach(() => {
      jest.spyOn(authenticationServiceMock, 'login').mockImplementation(() => {
        bearerToken$Mock.next(`new-${givenBearerToken}`);
        return of(true);
      });
    });

    it('should trigger login', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(invokeInterceptor());
      });

      expect(authenticationServiceMock.login).toHaveBeenCalledTimes(1);
    });

    it('should pass request clone having new bearer token set in Authorization header', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(invokeInterceptor()).toBe('(x|)', {
          x: givenResponse,
        });
      });

      expect(requestMock.clone).toHaveBeenCalledWith({
        setHeaders: {
          Authorization: `Bearer new-${givenBearerToken}`,
        },
      });
      expect(requestMock.clone).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(givenRequestClone);
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when bearer token is not available and session is not active', () => {
    beforeEach(() => {
      jest.spyOn(authenticationServiceMock, 'login').mockReturnValue(of(false));
    });

    it('should trigger login', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(invokeInterceptor());
      });

      expect(authenticationServiceMock.login).toHaveBeenCalledTimes(1);
    });

    it('should not pass request clone to next function, nor return response', () => {
      runInTestScheduler(({ expectObservable }) => {
        expectObservable(invokeInterceptor()).toBe('|');
      });

      expect(requestMock.clone).toHaveBeenCalledTimes(0);
      expect(nextMock).toHaveBeenCalledTimes(0);
    });
  });
});
