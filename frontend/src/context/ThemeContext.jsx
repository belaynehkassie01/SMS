// context/ThemeContext.jsx
import React, {createContext,useState, useEffect,useCallback,useContext,useMemo
} from "react";
const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = 'sms_theme';
const DEFAULT_THEME = 'light';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && (saved === 'light' || saved === 'dark')) return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return DEFAULT_THEME;
  });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.setAttribute('data-bs-theme', 'dark');
    } else {
      root.classList.remove('dark-theme');
      root.setAttribute('data-bs-theme', 'light');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setLight = useCallback(() => setTheme('light'), []);
  const setDark = useCallback(() => setTheme('dark'), []);

  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setLight,
    setDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};