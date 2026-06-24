import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getItem, setItem } from '../utils/localStorage';

const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = getItem(STORAGE_KEYS.THEME);
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen for custom theme change events across instances
  useEffect(() => {
    const handleThemeChange = (e) => {
      setIsDarkMode(e.detail === 'dark');
    };
    
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      root.classList.remove('dark');
      setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    // Dispatch event so other instances of useTheme (like in App.jsx) update their state
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }));
  }, [isDarkMode]);

  return { isDarkMode, toggleTheme };
};

export default useTheme;
