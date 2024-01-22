import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { FinancialOverviewComponent } from './financial-overview.component';

describe('FinancialOverviewComponent', () => {
  beforeEach(() => MockBuilder(FinancialOverviewComponent));

  beforeEach(() => MockRender(FinancialOverviewComponent));

  it('should render accounts', () => {
    expect(ngMocks.findAll('.list-group-item')).toHaveLength(2);
  });
});
