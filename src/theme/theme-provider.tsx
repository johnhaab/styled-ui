import React from "react";
import { darkTheme, lightTheme, ThemeType } from "./theme";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = React.useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? lightTheme : darkTheme;
  });

  React.useEffect(() => {
    localStorage.setItem("theme", theme === darkTheme ? "dark" : "light");
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prevTheme: ThemeType) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
