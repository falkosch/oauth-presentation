import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { Profile, ProfileService } from '@the-online-bank/settings-data-access';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  const givenProfile: Profile = {
    id: 'test-id',
    username: 'test-username',
    emailVerified: false,
  };

  beforeEach(() =>
    MockBuilder(ProfileComponent).mock(ProfileService, {
      getProfile: jest.fn().mockReturnValue(of(givenProfile)),
    })
  );

  beforeEach(() => MockRender(ProfileComponent));

  it('should get profile', () => {
    expect(ngMocks.get(ProfileService).getProfile).toHaveBeenCalledTimes(1);
  });

  it('should render username', () => {
    expect(ngMocks.find('h2').nativeElement.textContent).toEqual(givenProfile.username);
  });
});
