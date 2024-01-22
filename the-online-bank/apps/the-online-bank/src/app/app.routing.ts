import { Route } from '@angular/router';

import { authenticatedGuard } from '@the-online-bank/shared-authentication-data-access-access-management';

import { LandingPageComponent } from '../landing-page/landing-page.component';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
  },
  {
    path: 'banking/overview',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('@the-online-bank/accounts-feature-financial-overview').then(
        (m) => m.FinancialOverviewComponent
      ),
  },
  {
    path: 'banking/turnover/:account',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('@the-online-bank/accounts-feature-turnover').then((m) => m.TurnoverComponent),
  },
  {
    path: 'brokerage/portfolio',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('@the-online-bank/brokerage-feature-portfolio').then((m) => m.PortfolioComponent),
  },
  {
    path: 'profile',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('@the-online-bank/settings-feature-profile').then((m) => m.ProfileComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
