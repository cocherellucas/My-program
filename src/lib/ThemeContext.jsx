import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('violet');

  const themeStyles = {
    violet: {
      '--primary': '280 70% 55%',
      '--primary-foreground': '0 0% 100%',
      '--background': '270 20% 95%',
      '--foreground': '270 20% 15%',
      '--card': '0 0% 100%',
      '--card-foreground': '270 20% 15%',
      '--accent': '180 80% 45%',
      '--secondary': '270 15% 85%',
      '--secondary-foreground': '270 20% 20%',
      '--muted': '270 15% 85%',
      '--muted-foreground': '270 10% 45%',
      '--sidebar-background': '270 25% 12%',
      '--sidebar-foreground': '270 10% 85%',
      '--border': '270 15% 85%',
    },
    white: {
      '--primary': '280 70% 52%',
      '--primary-foreground': '0 0% 100%',
      '--background': '0 0% 99%',
      '--foreground': '0 0% 15%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 15%',
      '--accent': '220 90% 52%',
      '--secondary': '0 0% 92%',
      '--secondary-foreground': '0 0% 20%',
      '--muted': '0 0% 92%',
      '--muted-foreground': '0 0% 45%',
      '--sidebar-background': '0 0% 97%',
      '--sidebar-foreground': '0 0% 20%',
      '--border': '0 0% 90%',
    },
    black: {
      '--primary': '200 100% 50%',
      '--primary-foreground': '0 0% 100%',
      '--background': '220 15% 10%',
      '--foreground': '220 10% 95%',
      '--card': '220 20% 15%',
      '--card-foreground': '220 10% 95%',
      '--accent': '170 80% 50%',
      '--secondary': '220 20% 20%',
      '--secondary-foreground': '220 10% 90%',
      '--muted': '220 20% 20%',
      '--muted-foreground': '220 10% 55%',
      '--sidebar-background': '220 20% 8%',
      '--sidebar-foreground': '220 10% 85%',
      '--border': '220 20% 18%',
    },
  };

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeStyles[theme]).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}