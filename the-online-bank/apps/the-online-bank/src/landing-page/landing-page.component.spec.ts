import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  beforeEach(() => MockBuilder(LandingPageComponent));

  beforeEach(() => MockRender(LandingPageComponent));

  it('should create', () => {
    expect(ngMocks.findInstance(LandingPageComponent)).toBeTruthy();
  });
});
