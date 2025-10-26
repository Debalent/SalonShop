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
  const [customColors, setCustomColors] = useState({
    primary: null,
    accent: null,
    background: null,
  });

  useEffect(() => {
    loadThemePreference();
    loadCustomColors();
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

  const loadCustomColors = async () => {
    try {
      const stored = await AsyncStorage.getItem('customColors');
      if (stored) {
        setCustomColors(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading custom colors:', error);
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

  const updateCustomColors = async (colors) => {
    try {
      const newColors = { ...customColors, ...colors };
      await AsyncStorage.setItem('customColors', JSON.stringify(newColors));
      setCustomColors(newColors);
    } catch (error) {
      console.error('Error saving custom colors:', error);
    }
  };

  const resetCustomColors = async () => {
    try {
      await AsyncStorage.removeItem('customColors');
      setCustomColors({ primary: null, accent: null, background: null });
    } catch (error) {
      console.error('Error resetting custom colors:', error);
    }
  };

  const baseTheme = isDarkMode ? darkTheme : lightTheme;

  // Apply custom colors if they exist
  const theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...(customColors.primary && { primary: customColors.primary }),
      ...(customColors.accent && { accent: customColors.accent }),
      ...(customColors.background && { background: customColors.background }),
    },
  };

  const value = {
    theme,
    isDarkMode,
    themePreference,
    customColors,
    updateThemePreference,
    updateCustomColors,
    resetCustomColors,
    toggleTheme: () => updateThemePreference(isDarkMode ? 'light' : 'dark'),
    // Accessibility helpers
    getAccessibleColor: (colorKey, fallback) => {
      // Ensure sufficient contrast for accessibility
      const color = theme.colors[colorKey] || fallback;
      // In a real implementation, you'd check contrast ratios here
      return color;
    },
    announceForAccessibility: (message) => {
      if (AccessibilityInfo) {
        AccessibilityInfo.announceForAccessibility(message);
      }
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};