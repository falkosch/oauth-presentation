import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'the-online-bank-landing-page',
  standalone: true,
  styleUrls: ['./landing-page.component.scss'],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {}
