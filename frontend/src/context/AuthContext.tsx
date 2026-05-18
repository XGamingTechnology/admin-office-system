import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// frontend/src/context/AuthContext.tsx - Update User type
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: "admin" | "user"; // ← ← ← TAMBAHKAN INI
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = (import.meta as any).env?.VITE_API_URL || "https://office.getopurtunity.online/api/office";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("office_token");
    const savedUser = localStorage.getItem("office_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("office_token", data.access_token);
      localStorage.setItem("office_user", JSON.stringify(data.user));
      return true;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem("office_token");
    localStorage.removeItem("office_user");
  };

  return <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading, error, clearError }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
