import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AccessibilityInfo } from 'react-native';

import { AuthProvider } from './services/AuthContext';
import { ThemeProvider } from './themes/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import { lightTheme } from './themes/lightTheme';

export default function App() {
  // Set up accessibility announcements
  React.useEffect(() => {
    // Announce app launch for screen readers
    AccessibilityInfo.announceForAccessibility('SalonShop app launched');
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {({ theme }) => (
          <PaperProvider theme={theme}>
            <AuthProvider>
              <NavigationContainer
                theme={{
                  dark: theme.dark,
                  colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.background,
                    card: theme.colors.surface,
                    text: theme.colors.text,
                    border: theme.colors.outline,
                    notification: theme.colors.notification,
                  },
                }}
              >
                <RootNavigator />
                <StatusBar
                  style={theme.dark ? "light" : "dark"}
                  backgroundColor={theme.colors.background}
                />
              </NavigationContainer>
            </AuthProvider>
          </PaperProvider>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}