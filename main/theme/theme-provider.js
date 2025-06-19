import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { darkTheme, lightTheme } from "./theme";
const ThemeContext = React.createContext(undefined);
export const ThemeProvider = ({ children, }) => {
    const [theme, setTheme] = React.useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "light" ? lightTheme : darkTheme;
    });
    React.useEffect(() => {
        localStorage.setItem("theme", theme === darkTheme ? "dark" : "light");
    }, [theme]);
    const toggleTheme = React.useCallback(() => {
        setTheme((prevTheme) => prevTheme === lightTheme ? darkTheme : lightTheme);
    }, []);
    return (_jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children: children }));
};
export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
