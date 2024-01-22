import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BehaviorSubject, EMPTY, of, ReplaySubject, Subject } from 'rxjs';

import { SessionQuery } from '@the-online-bank/shared-authentication-data-access';
import { AuthenticationService } from '@the-online-bank/shared-authentication-data-access-access-management';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let isLoggedIn$: Subject<boolean>;
  let name$: Subject<string>;

  let authenticationServiceMock: AuthenticationService;
  let fixture: MockedComponentFixture<AppComponent>;

  beforeEach(() => {
    isLoggedIn$ = new BehaviorSubject(false);
    name$ = new ReplaySubject(1);

    return MockBuilder(AppComponent)
      .provide(provideNoopAnimations())
      .keep(BsDropdownModule)
      .mock(SessionQuery, {
        isLoggedIn$,
        name$,
      })
      .mock(AuthenticationService, {
        login: jest.fn().mockReturnValue(of(true)),
        logout: jest.fn().mockReturnValue(EMPTY),
      });
  });

  beforeEach(() => {
    fixture = MockRender(AppComponent);
    authenticationServiceMock = ngMocks.get(AuthenticationService);
  });

  it('should create', () => {
    expect(ngMocks.findInstance(AppComponent)).toBeTruthy();
  });

  it('should allow to login when not logged in', () => {
    const loginButton = ngMocks.find('[data-test=login]');
    expect(loginButton).toBeTruthy();
    loginButton.triggerEventHandler('click', {});

    expect(authenticationServiceMock.login).toHaveBeenCalledTimes(1);
  });

  it('should allow to logout via dropdown when logged in', () => {
    isLoggedIn$.next(true);
    fixture.detectChanges();

    const profileMenuDropdown = ngMocks.find('#profile-menu');
    expect(profileMenuDropdown).toBeTruthy();
    profileMenuDropdown.nativeElement.click();
    fixture.detectChanges();

    const logoutLink = ngMocks.find('[data-test=logout]');
    expect(logoutLink).toBeTruthy();
    logoutLink.triggerEventHandler('click', {});

    expect(authenticationServiceMock.logout).toHaveBeenCalledTimes(1);
  });
});
