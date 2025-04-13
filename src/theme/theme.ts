export interface ThemeType {
  primaryColor: string; // Should always be #818CF8 in both light and dark themes

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

  textColor: string; // Main text color
  textAltColor: string; // Slightly lighter text color
}

export const lightTheme: ThemeType = {
  primaryColor: "#818CF8", // Consistent across themes

  background: "#FAF9F6", // Soft off-white base
  background1: "#F5F5F5", // Light gray for subtle sections
  background2: "#EDEDED", // Slightly darker gray for depth
  background3: "#E0E0E0", // Medium gray for contrast
  background4: "#D6D6D6", // Deeper gray for emphasis

  midground: "#C0C0C0", // Neutral mid-tone
  midground1: "#B0B0B0", // Slightly darker mid-tone
  midground2: "#A0A0A0", // Medium-dark mid-tone
  midground3: "#909090", // Darker mid-tone
  midground4: "#808080", // Deepest mid-tone

  foregroundColor: "#FFFFFF", // Pure white for elevated elements

  borderColor: "#CCCCCC", // Light gray for borders

  textColor: "#1A1A1A", // Dark gray for primary text
  textAltColor: "#4D4D4D", // Medium gray for secondary text
};

export const darkTheme: ThemeType = {
  primaryColor: "#818CF8",

  background: "#000000",
  background1: "#0a0a0a",
  background2: "#121212",
  background3: "#171717",
  background4: "#1f1f1f",

  midground: "#262626",
  midground1: "#2e2e2e",
  midground2: "#363636",
  midground3: "#404040",
  midground4: "#525252",

  foregroundColor: "#0a0a0a",

  borderColor: "#262626",

  textColor: "#fafafa",
  textAltColor: "#d4d4d4",
};
