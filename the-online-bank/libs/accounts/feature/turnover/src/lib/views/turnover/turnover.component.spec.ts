import { provideRouter } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { TurnoverComponent } from './turnover.component';

describe('TurnoverComponent', () => {
  let routerHarness: RouterTestingHarness;

  beforeEach(() =>
    MockBuilder(TurnoverComponent)
      .keep(
        provideRouter([
          {
            path: ':account',
            component: TurnoverComponent,
          },
        ])
      )
      .keep(RouterTestingModule.withRoutes([]))
  );

  beforeEach(async () => {
    routerHarness = await RouterTestingHarness.create();
  });

  it('should render savings dummy data when account id is savings', async () => {
    await routerHarness.navigateByUrl('savings', TurnoverComponent);

    expect(ngMocks.find('h2').nativeElement.textContent).toEqual('Savings Account');
    expect(ngMocks.findAll('li.list-group-item')).toHaveLength(0);
  });

  it('should render current dummy data when account id is current', async () => {
    await routerHarness.navigateByUrl('current', TurnoverComponent);

    expect(ngMocks.find('h2').nativeElement.textContent).toEqual('Current Account');
    expect(ngMocks.findAll('li.list-group-item')).toHaveLength(5);
  });

  it('should render nothing when account id cannot be mapped to dummy data', async () => {
    await routerHarness.navigateByUrl('unknown', TurnoverComponent);

    expect(ngMocks.findAll('h2')).toHaveLength(0);
  });
});
