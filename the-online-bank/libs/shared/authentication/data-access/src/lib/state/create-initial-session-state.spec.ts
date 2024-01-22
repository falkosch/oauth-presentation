import { createInitialSessionState } from './create-initial-session-state';

describe('createInitialSessionState', () => {
  it('should return initial session state without token or claims', () => {
    expect(createInitialSessionState()).toEqual({
      bearerToken: null,
      tokenClaims: null,
    });
  });
});
