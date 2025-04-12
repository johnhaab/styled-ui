export interface ThemeType {
  primaryColor: string; // Primary brand color
  background: string; // Main background color
  background1: string; // Alternate background color 1
  background2: string; // Alternate background color 2
  background3: string; // Alternate background color 3
  background4: string; // Alternate background color 4
  midground: string; // Main midground color
  midground1: string; // Alternate midground color 1
  midground2: string; // Alternate midground color 2
  midground3: string; // Alternate midground color 3
  midground4: string; // Alternate midground color 4
  foregroundColor: string; // Foreground color (e.g., for modals or popups)
  textColor: string; // Main text color
  textAltColor: string; // Alternate text color (e.g., for subtitles)
  borderColor: string; // Border color for dividers or outlines
}

// Light Theme - Clean and minimal
export const lightTheme: ThemeType = {
  primaryColor: "#818CF8", // Soft lavender-indigo for contrast
  background: "#F5EFE6", // Warm creme white
  background1: "#F2EAE2", // Soft off-white
  background2: "#EDE3DA", // Warm beige
  background3: "#E5DBD0", // Muted sand
  background4: "#DDD3C8", // Subtle warm gray
  midground: "#bfbfbf", // Very soft warm white
  midground1: "#F4EEE8", // Light muted creamy white
  midground2: "#F0E9E4", // Soft neutral off-white
  midground3: "#EBE4DE", // Warmer pale sand
  midground4: "#E6DFD9", // Lightest neutral brown
  foregroundColor: "#FCF8F3", // Softer white
  textColor: "#141414", // Deep charcoal
  textAltColor: "#212121", // Muted dark gray
  borderColor: "#D9CFC6", // Soft neutral border
};

// Dark Theme - True black with subtle gradients
export const darkTheme: ThemeType = {
  primaryColor: "#818CF8", // Soft indigo
  background: "#000000", // True black
  background1: "#0a0a0a", // Barely off-black
  background2: "#121212", // Slight gray-black
  background3: "#171717", // Dark gray-black
  background4: "#1f1f1f", // Rich gray-black
  midground: "#262626", // Deep gray
  midground1: "#2e2e2e", // Medium gray
  midground2: "#363636", // Light gray
  midground3: "#404040", // Lighter gray
  midground4: "#525252", // Light warm gray
  foregroundColor: "#0a0a0a", // Nearly black
  textColor: "#fafafa", // Nearly white
  textAltColor: "#d4d4d4", // Light gray
  borderColor: "#262626", // Subtle border
};
