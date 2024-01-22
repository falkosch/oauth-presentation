import { TokenClaims } from './token-claims';

export interface SessionState {
  bearerToken: string | null;
  tokenClaims: TokenClaims | null;
}
