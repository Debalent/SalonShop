import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [themePreference, setThemePreference] = useState('system'); // 'light', 'dark', 'system'

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themePreference === 'system') {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, themePreference]);

  const loadThemePreference = async () => {
    try {
      const stored = await AsyncStorage.getItem('themePreference');
      if (stored) {
        const preference = stored;
        setThemePreference(preference);
        if (preference === 'light') {
          setIsDarkMode(false);
        } else if (preference === 'dark') {
          setIsDarkMode(true);
        }
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const updateThemePreference = async (preference) => {
    try {
      await AsyncStorage.setItem('themePreference', preference);
      setThemePreference(preference);
      
      if (preference === 'light') {
        setIsDarkMode(false);
      } else if (preference === 'dark') {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    themePreference,
    updateThemePreference,
    toggleTheme: () => updateThemePreference(isDarkMode ? 'light' : 'dark'),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};