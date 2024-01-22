import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { PortfolioComponent } from './portfolio.component';

describe('PortfolioComponent', () => {
  beforeEach(() => MockBuilder(PortfolioComponent));

  beforeEach(() => MockRender(PortfolioComponent));

  it('should create', () => {
    expect(ngMocks.findInstance(PortfolioComponent)).toBeTruthy();
  });
});
