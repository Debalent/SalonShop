import { DefaultTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Inspired by Hideaway Pizza's warm, inviting colors
    primary: '#D32F2F', // Rich red - main brand color
    accent: '#FF5722', // Orange accent
    background: '#FAFAFA', // Light gray background
    surface: '#FFFFFF', // White surface
    text: '#212121', // Dark gray text
    onSurface: '#757575', // Medium gray text
    disabled: '#BDBDBD', // Light gray disabled
    placeholder: '#9E9E9E', // Placeholder text
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF5722',
    
    // Custom colors for salon app
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Service type colors
    nails: '#E91E63',
    hair: '#9C27B0',
    massage: '#3F51B5',
    tattoo: '#607D8B',
    dispensary: '#4CAF50',
    
    // Status colors
    confirmed: '#4CAF50',
    pending: '#FF9800',
    cancelled: '#F44336',
    completed: '#2196F3',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  roundness: 8,
  // Custom spacing system
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  // Custom layout values
  layout: {
    headerHeight: 64,
    tabBarHeight: 60,
    borderRadius: 8,
    cardElevation: 2,
  }
};