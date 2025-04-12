import React from "react";
import { ThemeType } from "./theme";
interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: () => void;
}
export declare const ThemeProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useTheme: () => ThemeContextType;
export {};
