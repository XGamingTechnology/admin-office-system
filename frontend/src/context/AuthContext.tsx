import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null; // ← ← ← TAMBAHKAN INI!
  clearError: () => void; // ← Optional: untuk clear error manual
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "https://office.getopurtunity.online/api/office";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ← ← ← TAMBAHKAN STATE ERROR

  // Load token dari localStorage saat app start
  useEffect(() => {
    const savedToken = localStorage.getItem("office_token");
    const savedUser = localStorage.getItem("office_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Helper untuk clear error (opsional tapi berguna)
  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null); // Clear error sebelumnya

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Set error dari response API atau default message
        throw new Error(data.message || "Email atau password salah");
      }

      // Simpan token & user data
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("office_token", data.access_token);
      localStorage.setItem("office_user", JSON.stringify(data.user));

      return true;
    } catch (err: any) {
      // Set error state agar bisa ditampilkan di UI
      setError(err.message || "Terjadi kesalahan saat login");
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null); // Clear error saat logout
    localStorage.removeItem("office_token");
    localStorage.removeItem("office_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
        error, // ← ← ← TAMBAHKAN KE CONTEXT VALUE
        clearError, // ← Optional
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
