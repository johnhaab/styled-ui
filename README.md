# 🧩 styled-ui

A tiny custom styled-component system with built-in theming support for React.

Supports dynamic theming (light/dark), pseudo-selectors, and React 18+ and 19+ out of the box.

---

## ✨ Features

- ✅ Custom `styled()` function with typed props
- 🎨 Theme context with `ThemeProvider` and `useTheme()`
- 🌓 Light and dark themes built-in
- 💅 Supports pseudo-classes like `:hover`, `& > span`, etc.

---

## 📦 Installation

From GitHub (private):

```bash
npm install git+https://github.com/johnhaab/styled-ui.git#v0.0.3
```

> Replace `v0.0.3` with the latest tag as needed.

---

## 🚀 Usage

### Wrap your app:

```tsx
import { ThemeProvider } from "styled-ui";

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

---

### Create a styled component:

```tsx
import { styled, useTheme } from "styled-ui";

const Box = styled("div", ({ $theme }) => ({
  backgroundColor: $theme.background,
  color: $theme.text,
  padding: 16,
  borderRadius: 8,
  ":hover": {
    opacity: 0.8,
  },
}));

function Example() {
  const { toggleTheme } = useTheme();

  return (
    <>
      <Box>Hello world</Box>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </>
  );
}
```

---

## 🛠 Theme Types

You can customize the theme system by editing `themes.ts`.

```ts
export type ThemeType = {
  background: string;
  text: string;
};

export const lightTheme: ThemeType = {
  background: "#ffffff",
  text: "#000000",
};

export const darkTheme: ThemeType = {
  background: "#000000",
  text: "#ffffff",
};
```

---

## 💡 Tips

- Works with React 18 and 19
- No reload required — styles update live when theme changes
- Extend `ThemeType` to support tokens, spacing, etc.
- Can be used in React Native with slight modifications

---

## 🔒 License

Private – © [johnhaab](https://github.com/johnhaab)
