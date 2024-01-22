import { KeycloakTokenParsed } from 'keycloak-js';

export interface AccessToken {
  encoded: string;
  claims: KeycloakTokenParsed;
}
