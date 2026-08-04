import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { AuthUser, IAuthService } from "./types";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authService: IAuthService;
  login: (email?: string) => Promise<void>;
  signup: (email?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  authService: IAuthService;
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  authService,
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        const token = await authService.getAccessToken();
        if (isMounted) {
          if (token) {
            const authUser = await authService.getUser();
            if (isMounted) setUser(authUser);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error(
          "AuthProvider: Error checking authentication status:",
          error,
        );
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, [authService]);

  const login = useCallback(async (email?: string) => {
    setIsLoading(true);
    try {
      await authService.login(email);
      const token = await authService.getAccessToken();
      if (token) {
        const authUser = await authService.getUser();
        setUser(authUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("AuthProvider: Error during login:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const signup = useCallback(async (email?: string) => {
    setIsLoading(true);
    try {
      if (authService.signup) {
        await authService.signup(email);
      } else {
        await authService.login(email);
      }
      const token = await authService.getAccessToken();
      if (token) {
        const authUser = await authService.getUser();
        setUser(authUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("AuthProvider: Error during signup:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  // Proactive Session Timer: schedules automatic session cleanup when token expires
  useEffect(() => {
    if (!user || !authService.getTokenExpiry) return;

    let timer: ReturnType<typeof setTimeout>;

    const scheduleExpiryCheck = async () => {
      try {
        const expiryTime = await authService.getTokenExpiry!();
        if (!expiryTime) return;

        const timeRemaining = expiryTime - Date.now();
        if (timeRemaining <= 0) {
          console.log('AuthProvider: Token already expired. Logging out automatically.');
          await logout();
        } else {
          console.log(`AuthProvider: Scheduling automatic session cleanup in ${Math.round(timeRemaining / 1000)}s.`);
          timer = setTimeout(async () => {
            console.log('AuthProvider: Token expired during active session. Logging out automatically.');
            await logout();
          }, timeRemaining);
        }
      } catch (err) {
        console.error('AuthProvider: Error scheduling token expiry check:', err);
      }
    };

    scheduleExpiryCheck();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, authService, logout]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      authService,
      login,
      signup,
      logout,
    }),
    [user, isLoading, authService, login, signup, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
