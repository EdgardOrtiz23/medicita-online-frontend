import { createContext, useContext, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "medicita_authenticated_user";
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser);

  const setUser = (nextUser) => {
    setUserState(nextUser);
    if (nextUser) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: setUser,
    logout: () => setUser(null),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  return context;
}
