import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { runInTestScheduler } from '@the-online-bank/shared-util/testing';

import { ProfileApiService } from '../infrastructure/profile-api.service';
import { Profile } from '../model/profile';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  const givenProfile: Profile = {
    id: 'test',
    username: 'test',
    emailVerified: false,
  };

  beforeEach(() =>
    MockBuilder(ProfileService).mock(ProfileApiService, {
      getProfile: jest.fn().mockReturnValue(of(givenProfile)),
    })
  );

  beforeEach(() => MockRender(ProfileService));

  describe('.getProfile', () => {
    it('should get profile from api', () => {
      runInTestScheduler(({ expectObservable }) => {
        const profile$ = ngMocks.findInstance(ProfileService).getProfile();

        expectObservable(profile$).toBe('(x|)', {
          x: givenProfile,
        });
      });

      const apiServiceMock = ngMocks.findInstance(ProfileApiService);
      expect(apiServiceMock.getProfile).toHaveBeenCalledTimes(1);
    });
  });
});
