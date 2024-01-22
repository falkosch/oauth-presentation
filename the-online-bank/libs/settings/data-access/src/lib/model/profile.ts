export interface Profile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified: boolean;
  userProfileMetadata?: unknown;
  attributes?: unknown;
}
