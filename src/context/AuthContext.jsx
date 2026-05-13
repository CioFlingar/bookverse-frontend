import { useState } from "react";
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

  const login = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    localStorage.setItem("userInfo", JSON.stringify(updated));
    setUser(updated);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
