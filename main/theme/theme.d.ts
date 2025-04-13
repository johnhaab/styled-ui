export interface ThemeType {
    name: "light" | "dark";
    primaryColor: string;
    background: string;
    background1: string;
    background2: string;
    background3: string;
    background4: string;
    midground: string;
    midground1: string;
    midground2: string;
    midground3: string;
    midground4: string;
    foregroundColor: string;
    borderColor: string;
    textColor: string;
    textAltColor: string;
}
export declare const lightTheme: ThemeType;
export declare const darkTheme: ThemeType;
