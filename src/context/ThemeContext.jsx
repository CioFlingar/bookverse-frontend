import { createContext, useState } from "react";

const ThemeContext = createContext();

const getStoredTheme = () => localStorage.getItem("theme") === "dark";

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(getStoredTheme);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return !prev;
    });
  };

  const value = {
    isDark,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
