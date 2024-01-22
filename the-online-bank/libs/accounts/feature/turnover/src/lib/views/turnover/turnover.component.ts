import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  selector: 'the-online-bank-turnover',
  standalone: true,
  styleUrl: './turnover.component.scss',
  templateUrl: './turnover.component.html',
})
export class TurnoverComponent {
  readonly allAccounts = [
    {
      account: 'savings',
      name: 'Savings Account',
      balance: '0',
      currency: 'EUR',
      transactions: [],
    },
    {
      account: 'current',
      name: 'Current Account',
      balance: '1337.42',
      currency: 'EUR',
      transactions: [
        {
          date: '2024-01-21T13:22:50.466Z',
          comment: 'Rent',
          amount: '-13',
          currency: 'EUR',
        },
        {
          date: '2024-01-20T00:00:00.000Z',
          comment: 'Cake Factory',
          amount: '-534.93',
          currency: 'EUR',
        },
        {
          date: '2024-01-19T00:00:00.000Z',
          comment: 'Cake Factory',
          amount: '-612.91',
          currency: 'EUR',
        },
        {
          date: '2024-01-18T00:00:00.000Z',
          comment: 'Cake Factory',
          amount: '-501.54',
          currency: 'EUR',
        },
        {
          date: '2024-01-16T00:00:00.000Z',
          comment: 'Cake Factory',
          amount: '-949.67',
          currency: 'EUR',
        },
      ],
    },
  ];

  readonly turnover$ = this.activatedRoute.params.pipe(
    map((params) => params['account']),
    filter(Boolean),
    map((account) => this.allAccounts.find((item) => item.account === account)),
    filter(Boolean)
  );

  constructor(private readonly activatedRoute: ActivatedRoute) {}
}
