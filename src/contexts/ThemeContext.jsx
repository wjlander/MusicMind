import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update CSS custom properties based on theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#1a1a2e');
      root.style.setProperty('--bg-secondary', '#16213e');
      root.style.setProperty('--bg-card', '#0f3460');
      root.style.setProperty('--text-primary', '#e94560');
      root.style.setProperty('--text-secondary', '#f5f5f5');
      root.style.setProperty('--text-muted', '#b0b0b0');
      root.style.setProperty('--accent-primary', '#e94560');
      root.style.setProperty('--accent-secondary', '#f39800');
      root.style.setProperty('--border-color', '#2a2a4a');
      root.style.setProperty('--shadow', 'rgba(233, 69, 96, 0.1)');
    } else {
      root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      root.style.setProperty('--bg-secondary', '#f8f9ff');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#1a1a1a');
      root.style.setProperty('--text-secondary', '#333333');
      root.style.setProperty('--text-muted', '#666666');
      root.style.setProperty('--accent-primary', '#667eea');
      root.style.setProperty('--accent-secondary', '#48bb78');
      root.style.setProperty('--border-color', '#e1e5e9');
      root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};