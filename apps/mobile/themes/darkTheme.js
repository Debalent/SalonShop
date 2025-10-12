import { DefaultTheme } from 'react-native-paper';

export const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF5252', // Brighter red for dark mode
    accent: '#FF7043', // Warm orange accent
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Dark surface
    text: '#FFFFFF', // White text
    onSurface: '#E0E0E0', // Light gray text
    disabled: '#616161', // Gray disabled
    placeholder: '#9E9E9E', // Placeholder text
    backdrop: 'rgba(0, 0, 0, 0.7)',
    notification: '#FF7043',
    
    // Custom colors for salon app (dark mode variants)
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    info: '#42A5F5',
    
    // Service type colors (adjusted for dark mode)
    nails: '#F06292',
    hair: '#BA68C8',
    massage: '#7986CB',
    tattoo: '#90A4AE',
    dispensary: '#66BB6A',
    
    // Status colors (adjusted for dark mode)
    confirmed: '#66BB6A',
    pending: '#FFB74D',
    cancelled: '#EF5350',
    completed: '#42A5F5',
  },
  fonts: {
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
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  layout: {
    headerHeight: 64,
    tabBarHeight: 60,
    borderRadius: 8,
    cardElevation: 2,
  }
};