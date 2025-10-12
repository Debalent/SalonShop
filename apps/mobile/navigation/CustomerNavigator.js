import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../themes/ThemeContext';

// Customer screens
import HomeScreen from '../screens/customer/HomeScreen';
import BookingScreen from '../screens/customer/BookingScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import PaymentsScreen from '../screens/customer/PaymentsScreen';
import ServicesScreen from '../screens/customer/ServicesScreen';
import BookingDetailsScreen from '../screens/customer/BookingDetailsScreen';
import TechnicianProfileScreen from '../screens/customer/TechnicianProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BookingStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="BookingMain" component={BookingScreen} options={{ title: 'Book Appointment' }} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Appointment Details' }} />
      <Stack.Screen name="TechnicianProfile" component={TechnicianProfileScreen} options={{ title: 'Technician Profile' }} />
    </Stack.Navigator>
  );
};

const ServicesStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="ServicesMain" component={ServicesScreen} options={{ title: 'Our Services' }} />
    </Stack.Navigator>
  );
};

const CustomerNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Services') {
            iconName = 'spa';
          } else if (route.name === 'Booking') {
            iconName = 'event';
          } else if (route.name === 'Payments') {
            iconName = 'payment';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          height: theme.layout.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'SalonShop' }} />
      <Tab.Screen name="Services" component={ServicesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Booking" component={BookingStack} options={{ headerShown: false }} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;