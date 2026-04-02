import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSettings, updateTheme } from '../services/apiService';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (user) {
      getSettings().then(res => {
        if (res && res.theme) {
          setTheme(res.theme as Theme);
        }
      }).catch(err => console.error('Failed to load theme settings', err));
    }
  }, [user]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (user) {
      try {
        await updateTheme(newTheme);
      } catch (err) {
        console.error('Failed to update theme preference', err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
