import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  selector: 'the-online-bank-financial-overview',
  standalone: true,
  styleUrl: './financial-overview.component.scss',
  templateUrl: './financial-overview.component.html',
})
export class FinancialOverviewComponent {
  readonly totalBalance = '1337.42';
  readonly accounts = [
    {
      id: 'current',
      name: 'Current Account',
      balance: '1337.42',
      currency: 'EUR',
    },
    {
      id: 'savings',
      name: 'Savings Account',
      balance: '0',
      currency: 'EUR',
    },
  ];
}
