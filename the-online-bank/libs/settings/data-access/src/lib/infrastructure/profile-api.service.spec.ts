import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { firstValueFrom } from 'rxjs';

import { Profile } from '../model/profile';
import { ProfileApiService } from './profile-api.service';

describe('ProfileApiService', () => {
  const givenProfile: Profile = {
    id: 'test',
    username: 'test',
    emailVerified: false,
  };

  beforeEach(() =>
    MockBuilder(ProfileApiService).replace(HttpClientModule, HttpClientTestingModule)
  );

  beforeEach(() => MockRender(ProfileApiService));

  it('should get profile via ', async () => {
    const getProfile$ = firstValueFrom(ngMocks.get(ProfileApiService).getProfile());

    const httpMock = ngMocks.get(HttpTestingController);
    httpMock
      .expectOne({
        method: 'GET',
        url: 'http://localhost:8080/realms/customer/account',
      })
      .flush(givenProfile);

    await expect(getProfile$).resolves.toEqual(givenProfile);

    httpMock.verify();
  });
});
