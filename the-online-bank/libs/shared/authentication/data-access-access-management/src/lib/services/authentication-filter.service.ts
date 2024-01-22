import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthenticationFilterService {
  private readonly apisRequiringAuthentication = ['http://localhost:8080/realms/customer/account'];

  isProtected(url: string): boolean {
    return this.apisRequiringAuthentication.some((apiPrefix) => url.startsWith(apiPrefix));
  }

  isUnprotected(url: string): boolean {
    return !this.isProtected(url);
  }
}
