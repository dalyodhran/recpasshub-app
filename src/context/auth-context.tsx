import React, { createContext, useContext, useState } from "react";
import { AuthState, AuthTokens, UserProfile } from "@/types/auth";
import {
  fetchUserInfo,
  loginWithKeycloak,
  registerWithKeycloak,
} from "@/services/keycloak";

interface AuthContextType extends AuthState {
  login: (emailHint?: string) => Promise<void>;
  signup: (emailHint?: string) => Promise<void>;
  logout: () => void;
  setTokensAndUser: (tokens: AuthTokens, user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const setTokensAndUser = (tokens: AuthTokens, user: UserProfile) => {
    setState({
      tokens,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const login = async (emailHint?: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const tokens = await loginWithKeycloak(emailHint);
      if (tokens) {
        const user = await fetchUserInfo(tokens.accessToken);
        setTokensAndUser(tokens, user);
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error("Login error:", err);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const signup = async (emailHint?: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await registerWithKeycloak(emailHint);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const logout = () => {
    setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        setTokensAndUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
