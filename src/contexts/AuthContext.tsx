import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiLogin, apiSignup, apiGetMe, AuthResponse } from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("parksmart_token");
    if (storedToken) {
      setToken(storedToken);
      apiGetMe()
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          // Token expired/invalid
          localStorage.removeItem("parksmart_token");
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleAuthResponse = useCallback((data: AuthResponse) => {
    localStorage.setItem("parksmart_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    handleAuthResponse(data);
  }, [handleAuthResponse]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiSignup(name, email, password);
    handleAuthResponse(data);
  }, [handleAuthResponse]);

  const logout = useCallback(() => {
    localStorage.removeItem("parksmart_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
