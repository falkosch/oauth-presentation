import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'the-online-bank-portfolio',
  standalone: true,
  styleUrls: ['./portfolio.component.scss'],
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent {}
