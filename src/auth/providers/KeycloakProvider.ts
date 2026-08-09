import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { IAuthService, AuthUser, Role } from '../types';
import {
  loginWithKeycloak,
  registerWithKeycloak,
  logoutFromKeycloak,
  exchangeCodeForToken,
  getRedirectUri,
} from '@/services/keycloak';

const TOKEN_STORAGE_KEY = 'recpasshub_auth_access_token';
const ID_TOKEN_STORAGE_KEY = 'recpasshub_auth_id_token';
const INTENDED_ROLE_KEY = 'recpasshub_intended_role';

async function storeIntendedRole(role: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(INTENDED_ROLE_KEY, role);
  } else {
    await SecureStore.setItemAsync(INTENDED_ROLE_KEY, role);
  }
}

async function retrieveIntendedRole(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') return localStorage.getItem(INTENDED_ROLE_KEY);
    return null;
  } else {
    try {
      return await SecureStore.getItemAsync(INTENDED_ROLE_KEY);
    } catch (e) {
      return null;
    }
  }
}

async function storeToken(token: string, idToken?: string): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('🌐 [TokenStorage] Storing token in web localStorage...');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      if (idToken) localStorage.setItem(ID_TOKEN_STORAGE_KEY, idToken);
    }
  } else {
    console.log('🔐 [SecureStore] Calling SecureStore.setItemAsync to persist token securely on native hardware...');
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
    if (idToken) await SecureStore.setItemAsync(ID_TOKEN_STORAGE_KEY, idToken);
    console.log('✅ [SecureStore] Token successfully written to native SecureStore!');
  }
}

async function removeToken(): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('🌐 [TokenStorage] Removing token from web localStorage...');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(ID_TOKEN_STORAGE_KEY);
    }
  } else {
    console.log('🗑️ [SecureStore] Calling SecureStore.deleteItemAsync to purge token from native storage...');
    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    await SecureStore.deleteItemAsync(ID_TOKEN_STORAGE_KEY);
    console.log('☑️ [SecureStore] Token successfully purged from SecureStore!');
  }
}

async function retrieveIdToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(ID_TOKEN_STORAGE_KEY);
    }
    return null;
  } else {
    try {
      return await SecureStore.getItemAsync(ID_TOKEN_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }
}

async function retrieveToken(): Promise<string | null> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
    // Check if we just redirected back from Keycloak with an authorization code
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      console.log('🌐 [KeycloakProvider] Found OAuth callback code in URL! Exchanging for access token...');
      try {
        // Clear code from URL without triggering a full page reload
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);

        const intendedRole = await retrieveIntendedRole();
        const tokens = await exchangeCodeForToken(code, getRedirectUri(), intendedRole);
        if (tokens?.accessToken) {
          await storeToken(tokens.accessToken, tokens.idToken);
          return tokens.accessToken;
        }
      } catch (error) {
        console.error('🌐 [KeycloakProvider] Failed to exchange authorization code for token:', error);
      }
    }

    console.log('🌐 [TokenStorage] Reading token from web localStorage...');
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  } else {
    console.log('🔍 [SecureStore] Calling SecureStore.getItemAsync to retrieve persisted token...');
    const token = await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
    if (token) {
      console.log('✅ [SecureStore] Successfully retrieved persisted access token from SecureStore!');
    } else {
      console.log('ℹ️ [SecureStore] No existing token found in SecureStore.');
    }
    return token;
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decodedJson = atob(payloadBase64);
    return JSON.parse(decodedJson);
  } catch (error) {
    console.error('KeycloakProvider: Failed to decode JWT payload:', error);
    return null;
  }
}

export class KeycloakProvider implements IAuthService {
  public async login(email?: string, selectedRole?: string): Promise<void> {
    console.log(`KeycloakProvider: Initiating real Keycloak OIDC login flow${email ? ` for ${email}` : ''}...`);
    if (selectedRole) {
      await storeIntendedRole(selectedRole.toUpperCase());
    }

    const tokens = await loginWithKeycloak(email, selectedRole);
    if (tokens?.accessToken) {
      // Security Validation: Immediately verify if they actually got the Organizer role they requested!
      if (selectedRole?.toLowerCase() === 'organizer') {
        const payload = decodeJwtPayload(tokens.accessToken);
        const realmAccess = payload?.realm_access as { roles?: unknown } | undefined;
        const roles: string[] = Array.isArray(realmAccess?.roles) ? (realmAccess.roles as string[]) : [];
        
        if (!roles.includes('app-organizer') && !roles.includes('ORGANIZER') && !roles.includes('organizer')) {
          throw new Error("Access Denied: Your account does not have Organizer permissions. Please log in as an Attendee.");
        }
      }

      await storeToken(tokens.accessToken, tokens.idToken);
    }
  }

  public async signup(email?: string, selectedRole?: string): Promise<void> {
    console.log(`KeycloakProvider: Initiating Keycloak registration flow${email ? ` for ${email}` : ''}...`);
    if (selectedRole) {
      await storeIntendedRole(selectedRole.toUpperCase());
    }
    await registerWithKeycloak(email, selectedRole);
  }

  public async logout(): Promise<void> {
    console.log('KeycloakProvider: Logging out from Keycloak server session and purging stored tokens...');
    const idToken = await retrieveIdToken();
    const intendedRole = await retrieveIntendedRole();
    await removeToken();
    try {
      await logoutFromKeycloak(idToken, intendedRole);
    } catch (error) {
      console.error('KeycloakProvider: Failed during Keycloak end-session logout:', error);
    }
  }

  public async getAccessToken(): Promise<string | null> {
    const token = await retrieveToken();
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') {
      await removeToken();
      return null;
    }

    // Automatically purge and reject token if expiration time has passed
    if (Date.now() >= payload.exp * 1000) {
      console.warn('⚠️ [SecureStore] Stored token has expired! Purging storage and requiring login.');
      await removeToken();
      return null;
    }

    return token;
  }

  public async getTokenExpiry(): Promise<number | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (payload && typeof payload.exp === 'number') {
      return payload.exp * 1000;
    }
    return null;
  }

  public async getUser(): Promise<AuthUser | null> {
    const token = await this.getAccessToken();
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    const realmAccess = payload.realm_access as { roles?: unknown } | undefined;
    const roles: string[] = Array.isArray(realmAccess?.roles)
      ? (realmAccess.roles as string[])
      : [];
    
    const intendedRole = await retrieveIntendedRole();
    let role: Role = 'ATTENDEE';

    if (intendedRole === 'ORGANIZER' && (roles.includes('app-organizer') || roles.includes('ORGANIZER') || roles.includes('organizer'))) {
      role = 'ORGANIZER';
    } else if (intendedRole === 'ATTENDEE') {
      role = 'ATTENDEE';
    } else if (roles.includes('app-guest') || roles.includes('GUEST')) {
      role = 'GUEST';
    }

    const nameValue =
      typeof payload.name === 'string' && payload.name
        ? payload.name
        : typeof payload.preferred_username === 'string' && payload.preferred_username
        ? payload.preferred_username
        : typeof payload.email === 'string'
        ? payload.email
        : 'Keycloak User';

    return {
      id: typeof payload.sub === 'string' ? payload.sub : 'unknown_id',
      email: typeof payload.email === 'string' ? payload.email : 'unknown@example.com',
      name: nameValue,
      role,
    };
  }
}

