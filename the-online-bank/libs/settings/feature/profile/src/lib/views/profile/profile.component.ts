import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProfileService } from '@the-online-bank/settings-data-access';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'the-online-bank-profile',
  standalone: true,
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  readonly profile$ = this.profileService.getProfile();

  constructor(private readonly profileService: ProfileService) {}
}
