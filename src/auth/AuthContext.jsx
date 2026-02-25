import { createContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { encryptToken, decryptToken } from "../utils/tokenEncryption";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔁 Restore auth on refresh
  useEffect(() => {
    const encryptedToken = localStorage.getItem("token");
    if (encryptedToken) {
      (async () => {
        try {
          // Decrypt token from storage
          const token = await decryptToken(encryptedToken);
          const decoded = jwtDecode(token);
          setAuthToken(token);
          setUser({
            id: decoded.id,
            role: decoded.role
          });
        } catch (error) {
          console.error("Token restoration failed:", error);
          localStorage.clear();
        }
      })();
    }
  }, []);

  const login = async (token) => {
    try {
      const decoded = jwtDecode(token);

      // Encrypt token before storing
      const encryptedToken = await encryptToken(token);
      localStorage.setItem("token", encryptedToken);
      
      // Use plain token for API requests
      setAuthToken(token);

      setUser({
        id: decoded.id,
        role: decoded.role
      });
    } catch (error) {
      console.error("Login token encryption failed:", error);
      throw error;
    }
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
