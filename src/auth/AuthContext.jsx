import { createContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔁 Restore auth on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuthToken(token);
        setUser({
          id: decoded.id,
          role: decoded.role
        });
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);

    localStorage.setItem("token", token);
    setAuthToken(token);

    setUser({
      id: decoded.id,
      role: decoded.role
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
