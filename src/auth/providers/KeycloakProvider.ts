import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { IAuthService, AuthUser, Role } from '../types';

const TOKEN_STORAGE_KEY = 'recpasshub_auth_access_token';

async function storeToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('🌐 [TokenStorage] Storing token in web localStorage...');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  } else {
    console.log('🔐 [SecureStore] Calling SecureStore.setItemAsync to persist token securely on native hardware...');
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
    console.log('✅ [SecureStore] Token successfully written to native SecureStore!');
  }
}

async function removeToken(): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('🌐 [TokenStorage] Removing token from web localStorage...');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } else {
    console.log('🗑️ [SecureStore] Calling SecureStore.deleteItemAsync to purge token from native storage...');
    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    console.log('☑️ [SecureStore] Token successfully purged from SecureStore!');
  }
}

async function retrieveToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
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

/**
 * Keycloak configuration settings should be injected here or passed via constructor.
 * Typical configuration required for Keycloak in React Native / @react-keycloak/native:
 * - url / baseUrl: Keycloak server root URL (e.g., 'http://localhost:9080/auth' or OIDC endpoint)
 * - realm: The targeted Keycloak Realm (e.g., 'jhipster' or 'event-hub')
 * - clientId: The OIDC Client ID registered in Keycloak (e.g., 'web_app' or 'rn_app')
 */
export class KeycloakProvider implements IAuthService {
  // Optional injection point for Keycloak client configuration:
  // e.g., private config?: { url: string; realm: string; clientId: string; };

  public async login(email?: string): Promise<void> {
    console.log(`KeycloakProvider: Initiating login flow${email ? ` for ${email}` : ''}...`);
    const mockPayload = JSON.stringify({
      sub: 'usr-12345',
      email: email || 'organizer@recpasshub.com',
      name: 'Alex Johnson',
      realm_access: { roles: ['app-organizer', 'default-roles-jhipster'] },
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const encodedPayload = btoa(mockPayload);
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.mock_signature`;

    await storeToken(token);
  }

  public async signup(email?: string): Promise<void> {
    console.log(`KeycloakProvider: Initiating signup workflow${email ? ` for ${email}` : ''}...`);
    await this.login(email);
  }

  public async logout(): Promise<void> {
    console.log('KeycloakProvider: Logging out and purging stored tokens...');
    await removeToken();
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
    let role: Role = 'ATTENDEE';

    if (roles.includes('app-organizer') || roles.includes('ORGANIZER')) {
      role = 'ORGANIZER';
    } else if (roles.includes('app-guest') || roles.includes('GUEST')) {
      role = 'GUEST';
    }

    return {
      id: typeof payload.sub === 'string' ? payload.sub : 'unknown_id',
      email: typeof payload.email === 'string' ? payload.email : 'unknown@example.com',
      name: typeof payload.name === 'string' ? payload.name : 'Alex Johnson',
      role,
    };
  }
}
