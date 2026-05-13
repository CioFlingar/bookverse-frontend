import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContextObject";


const getStoredUser = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return null;

  try {
    return JSON.parse(userInfo);
  } catch (err) {
    console.error("Failed to load user:", err);
    localStorage.removeItem("userInfo");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading] = useState(false);

  const login = useCallback((userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("userInfo");
    setUser(null);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((currentUser) => {
      const updated = { ...currentUser, ...userData };
      localStorage.setItem("userInfo", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }), [loading, login, logout, updateUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
