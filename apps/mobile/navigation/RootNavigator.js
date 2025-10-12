import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../services/AuthContext';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import StaffNavigator from './StaffNavigator';
import CustomerNavigator from './CustomerNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  const getRoleNavigator = () => {
    if (!user) {
      return <AuthNavigator />;
    }

    switch (user.role) {
      case 'admin':
      case 'owner':
      case 'manager':
        return <AdminNavigator />;
      case 'staff':
      case 'technician':
      case 'stylist':
      case 'budtender':
        return <StaffNavigator />;
      case 'customer':
      default:
        return <CustomerNavigator />;
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={getRoleNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;