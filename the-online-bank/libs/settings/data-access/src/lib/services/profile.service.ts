import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfileApiService } from '../infrastructure/profile-api.service';
import { Profile } from '../model/profile';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private readonly profileApiService: ProfileApiService) {}

  getProfile(): Observable<Profile> {
    return this.profileApiService.getProfile();
  }
}
