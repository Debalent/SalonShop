import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './services/AuthContext';
import { ThemeProvider } from './themes/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import { lightTheme } from './themes/lightTheme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider theme={lightTheme}>
          <AuthProvider>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </AuthProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}