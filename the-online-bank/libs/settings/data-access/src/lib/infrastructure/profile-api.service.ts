import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Profile } from '../model/profile';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly baseUrl = 'http://localhost:8080/realms/customer/account';

  constructor(private readonly httpClient: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.httpClient.get<Profile>(this.baseUrl);
  }
}
