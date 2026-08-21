export type Role = "GUEST" | "ATTENDEE" | "ORGANIZER";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export interface IAuthService {
  login(email?: string, selectedRole?: string): Promise<void>;
  signup?(email?: string, selectedRole?: string): Promise<void>;
  logout(): Promise<void>;
  getUser(): Promise<AuthUser | null>;
  getAccessToken(): Promise<string | null>;
  getTokenExpiry?(): Promise<number | null>; // Returns expiration timestamp in milliseconds
  refreshToken?(): Promise<boolean>; // Returns true if refresh succeeded
}
