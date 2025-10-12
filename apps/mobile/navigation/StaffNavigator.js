import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../themes/ThemeContext';

// Staff screens
import StaffDashboardScreen from '../screens/staff/StaffDashboardScreen';
import AppointmentsScreen from '../screens/staff/AppointmentsScreen';
import ClientsScreen from '../screens/staff/ClientsScreen';
import EarningsScreen from '../screens/staff/EarningsScreen';
import ScheduleScreen from '../screens/staff/ScheduleScreen';
import ProfileScreen from '../screens/staff/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StaffNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Appointments') {
            iconName = 'event';
          } else if (route.name === 'Clients') {
            iconName = 'people';
          } else if (route.name === 'Earnings') {
            iconName = 'attach-money';
          } else if (route.name === 'Schedule') {
            iconName = 'schedule';
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
      <Tab.Screen name="Dashboard" component={StaffDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ title: 'Appointments' }} />
      <Tab.Screen name="Clients" component={ClientsScreen} options={{ title: 'My Clients' }} />
      <Tab.Screen name="Earnings" component={EarningsScreen} options={{ title: 'Earnings' }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Schedule' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default StaffNavigator;