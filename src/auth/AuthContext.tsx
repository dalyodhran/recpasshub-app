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
  login: (email?: string, selectedRole?: string) => Promise<void>;
  signup: (email?: string, selectedRole?: string) => Promise<void>;
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

  const login = useCallback(async (email?: string, selectedRole?: string) => {
    setIsLoading(true);
    try {
      await authService.login(email, selectedRole);
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

  const signup = useCallback(async (email?: string, selectedRole?: string) => {
    setIsLoading(true);
    try {
      if (authService.signup) {
        await authService.signup(email, selectedRole);
      } else {
        await authService.login(email, selectedRole);
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

  // Proactive Session Timer: schedules automatic session refresh before token expires
  useEffect(() => {
    if (!user || !authService.getTokenExpiry) return;

    let timer: ReturnType<typeof setTimeout>;

    const scheduleExpiryCheck = async () => {
      try {
        const expiryTime = await authService.getTokenExpiry!();
        if (!expiryTime) return;

        // Schedule refresh 30 seconds before expiration
        const timeRemaining = (expiryTime - Date.now()) - 30000;
        
        const handleExpiry = async () => {
          if (authService.refreshToken) {
            console.log('AuthProvider: Token expiring soon. Attempting automatic refresh...');
            const success = await authService.refreshToken();
            if (success) {
              console.log('AuthProvider: Token refreshed successfully. Rescheduling timer...');
              scheduleExpiryCheck();
              return;
            }
          }
          console.log('AuthProvider: Token expired and could not be refreshed. Logging out automatically.');
          await logout();
        };

        if (timeRemaining <= 0) {
          await handleExpiry();
        } else {
          console.log(`AuthProvider: Scheduling automatic session refresh in ${Math.round(timeRemaining / 1000)}s.`);
          timer = setTimeout(handleExpiry, timeRemaining);
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
