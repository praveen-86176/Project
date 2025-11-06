import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadTheme, saveTheme } from '../utils/storage';
import { StatusBar } from 'expo-status-bar';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const lightTheme = {
  colors: {
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    primary: '#6366F1',
    primaryGradient: ['#6366F1', '#8B5CF6'],
    secondary: '#10B981',
    border: '#E5E7EB',
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    accent: '#EC4899',
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.05)',
  },
};

const darkTheme = {
  colors: {
    background: '#0F172A',
    cardBackground: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    primary: '#818CF8',
    primaryGradient: ['#818CF8', '#A78BFA'],
    secondary: '#34D399',
    border: '#334155',
    danger: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    accent: '#F472B6',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.2)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await loadTheme();
      setIsDark(savedTheme);
    } catch (error) {
      __DEV__ && console.warn('Error loading theme:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await saveTheme(newTheme);
  };

  const theme = isDark ? darkTheme : lightTheme;

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
};
