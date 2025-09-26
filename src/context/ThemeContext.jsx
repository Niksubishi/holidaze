import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    if (isDarkMode) {
      document.body.style.backgroundColor = "#2A2A2A";
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "#F5EBDD";
      document.body.style.color = "#132F3D";
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    colors: isDarkMode
      ? {
          background: "#2A2A2A",
          text: "white",
          primary: "#489DA6",
          secondary: "#132F3D",
          headerBg: "#132F3D",
          navLinks: "#489DA6",
        }
      : {
          background: "#F5EBDD",
          text: "#132F3D",
          primary: "#489DA6",
          secondary: "#132F3D",
          headerBg: "#489DA6",
          navLinks: "#132F3D",
        },
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
