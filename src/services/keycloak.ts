import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

import { AuthTokens, UserProfile } from "@/types/auth";

WebBrowser.maybeCompleteAuthSession();

export const KEYCLOAK_CONFIG = {
  baseUrl: "http://localhost:9080",
  realm: "jhipster",
  clientId: "web_app",
  authEndpoint:
    "http://localhost:9080/realms/jhipster/protocol/openid-connect/auth",
  tokenEndpoint:
    "http://localhost:9080/realms/jhipster/protocol/openid-connect/token",
  registerEndpoint:
    "http://localhost:9080/realms/jhipster/protocol/openid-connect/registrations",
  userInfoEndpoint:
    "http://localhost:9080/realms/jhipster/protocol/openid-connect/userinfo",
  logoutEndpoint:
    "http://localhost:9080/realms/jhipster/protocol/openid-connect/logout",
};

export function getClientIdForRole(role?: string | null): string {
  if (role?.toLowerCase() === 'organizer') {
    return 'rec-pass-organizer';
  }
  return 'rec-pass-attendee';
}

export function getRedirectUri(): string {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location) {
      return `${window.location.origin}/`;
    }
    return "http://localhost:8081/";
  }
  return Linking.createURL("auth/callback");
}

export async function loginWithKeycloak(
  emailHint?: string,
  selectedRole?: string | null,
): Promise<AuthTokens | null> {
  const redirectUri = getRedirectUri();
  const clientId = getClientIdForRole(selectedRole);
  let authUrl = `${KEYCLOAK_CONFIG.authEndpoint}?client_id=${encodeURIComponent(
    clientId,
  )}&response_type=code&scope=openid%20profile%20email&redirect_uri=${encodeURIComponent(redirectUri)}&prompt=login`;

  if (emailHint && emailHint.trim()) {
    authUrl += `&login_hint=${encodeURIComponent(emailHint.trim())}`;
  }

  if (Platform.OS === "web") {
    window.location.href = authUrl;
    return null;
  }

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
  if (result.type === "success" && result.url) {
    const urlObj = new URL(result.url);
    const code = urlObj.searchParams.get("code");
    if (code) {
      return exchangeCodeForToken(code, redirectUri, selectedRole);
    }
  }
  return null;
}

export async function registerWithKeycloak(
  emailHint?: string,
  selectedRole?: string | null,
): Promise<void> {
  const redirectUri = getRedirectUri();
  const clientId = getClientIdForRole(selectedRole);
  let registerUrl = `${KEYCLOAK_CONFIG.registerEndpoint}?client_id=${encodeURIComponent(
    clientId,
  )}&response_type=code&scope=openid%20profile%20email&redirect_uri=${encodeURIComponent(redirectUri)}&prompt=login`;

  if (emailHint && emailHint.trim()) {
    registerUrl += `&login_hint=${encodeURIComponent(emailHint.trim())}`;
  }

  if (Platform.OS === "web") {
    window.location.href = registerUrl;
    return;
  }

  await WebBrowser.openAuthSessionAsync(registerUrl, redirectUri);
}

export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
  selectedRole?: string | null,
): Promise<AuthTokens> {
  const clientId = getClientIdForRole(selectedRole);
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch(KEYCLOAK_CONFIG.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  };
}

export async function fetchUserInfo(accessToken: string): Promise<UserProfile> {
  const res = await fetch(KEYCLOAK_CONFIG.userInfoEndpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
}

export async function logoutFromKeycloak(idToken?: string | null, selectedRole?: string | null): Promise<void> {
  const redirectUri = getRedirectUri();
  const clientId = getClientIdForRole(selectedRole);
  let logoutUrl = `${KEYCLOAK_CONFIG.logoutEndpoint}?client_id=${encodeURIComponent(
    clientId,
  )}&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;

  if (idToken) {
    logoutUrl += `&id_token_hint=${encodeURIComponent(idToken)}`;
  }

  try {
    // Perform a silent background fetch to notify Keycloak server to terminate session
    // without launching any browser popup or intrusive window redirection.
    await fetch(logoutUrl, { method: "GET" });
  } catch (e) {
    console.log("Silent background Keycloak logout fetch completed or ignored:", e);
  }
}

