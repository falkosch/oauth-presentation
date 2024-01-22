import { SessionState } from '../model/session-state';

export const createInitialSessionState = (): SessionState => {
  return {
    bearerToken: null,
    tokenClaims: null,
  };
};
