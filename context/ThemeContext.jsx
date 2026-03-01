"use client"
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ isDark: false });

export const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedTheme = localStorage.getItem("isDark");
    console.log({ storedTheme })
    return storedTheme ? JSON.parse(storedTheme) : false;
  });

  console.log({ isDarkTheme: isDark })

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Apply theme to DOM
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        setIsDark,
        isLoggedIn,
        setIsLoggedIn,
        showUserProfile,
        setShowUserProfile,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

