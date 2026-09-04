import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearSession,
  fetchCurrentUser,
  getToken,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!getToken()) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        clearSession();
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    const handleUnauthorized = () => {
      clearSession();
      setUser(null);
    };

    window.addEventListener("medicita:unauthorized", handleUnauthorized);
    return () => {
      cancelled = true;
      window.removeEventListener("medicita:unauthorized", handleUnauthorized);
    };
  }, []);

  const value = useMemo(() => {
    const permissions = user?.permissions ?? [];
    return {
      user,
      setUser,
      loading,
      can: (key) => permissions.includes(key),
      login: async (credentials) => {
        const data = await loginUser(credentials);
        setUser(data.user);
        return data;
      },
      register: async (userData) => {
        const data = await registerUser(userData);
        setUser(data.user);
        return data;
      },
      logout: async () => {
        await logoutUser();
        setUser(null);
      },
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
