import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  user: null,
  token: null,
  login: async (_email, _password) => {},
  // PUBLIC_INTERFACE
  register: async (_email, _password, _name) => {},
  logout: () => {},
  ready: false,
});

/** PUBLIC_INTERFACE
 * AuthProvider manages auth token and user profile, persisting token in localStorage.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("tp_token") || null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function init() {
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const profile = await api.me(token);
        if (!ignore) setUser(profile);
      } catch (_e) {
        localStorage.removeItem("tp_token");
        if (!ignore) setToken(null);
      } finally {
        if (!ignore) setReady(true);
      }
    }
    init();
    return () => { ignore = true; };
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.access_token);
    localStorage.setItem("tp_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (email, password, name) => {
    const data = await api.register(email, password, name);
    setToken(data.access_token);
    localStorage.setItem("tp_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("tp_token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, register, logout, ready }), [user, token, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
