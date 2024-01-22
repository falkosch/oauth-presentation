import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { take } from 'rxjs';

import { SessionQuery } from '@the-online-bank/shared-authentication-data-access';
import { AuthenticationService } from '@the-online-bank/shared-authentication-data-access-access-management';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, BsDropdownModule],
  selector: 'the-online-bank',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly isLoggedIn$ = this.sessionQuery.isLoggedIn$;
  readonly username$ = this.sessionQuery.name$;

  constructor(
    private readonly sessionQuery: SessionQuery,
    private readonly authenticationService: AuthenticationService
  ) {}

  login(): void {
    this.authenticationService.login().pipe(take(1)).subscribe();
  }

  logout(): void {
    this.authenticationService.logout().pipe(take(1)).subscribe();
  }
}
