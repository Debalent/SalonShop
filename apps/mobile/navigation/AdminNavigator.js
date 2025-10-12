import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../themes/ThemeContext';

// Admin screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import StaffManagementScreen from '../screens/admin/StaffManagementScreen';
import BusinessAnalyticsScreen from '../screens/admin/BusinessAnalyticsScreen';
import PayrollScreen from '../screens/admin/PayrollScreen';
import InventoryScreen from '../screens/admin/InventoryScreen';
import SettingsScreen from '../screens/admin/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Staff') {
            iconName = 'group';
          } else if (route.name === 'Analytics') {
            iconName = 'analytics';
          } else if (route.name === 'Payroll') {
            iconName = 'payment';
          } else if (route.name === 'Inventory') {
            iconName = 'inventory';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
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
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
      <Tab.Screen name="Staff" component={StaffManagementScreen} options={{ title: 'Staff Management' }} />
      <Tab.Screen name="Analytics" component={BusinessAnalyticsScreen} options={{ title: 'Analytics' }} />
      <Tab.Screen name="Payroll" component={PayrollScreen} options={{ title: 'Payroll' }} />
      <Tab.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;