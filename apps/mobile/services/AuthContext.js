import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      
      // Check for stored user data
      const userData = await AsyncStorage.getItem('userData');
      const storedToken = await getStoredToken();
      
      if (userData && storedToken) {
        setUser(JSON.parse(userData));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoredToken = async () => {
    try {
      const credentials = await Keychain.getInternetCredentials('salonshop_token');
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  };

  const storeToken = async (tokenValue) => {
    try {
      await Keychain.setInternetCredentials('salonshop_token', 'token', tokenValue);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  const removeToken = async () => {
    try {
      await Keychain.resetInternetCredentials('salonshop_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          email: email,
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          role: 'customer',
          avatar: null,
          preferences: {
            notifications: true,
            language: 'en',
            theme: 'light',
          },
        },
        token: 'mock_jwt_token_' + Date.now(),
      };

      if (mockResponse.success) {
        setUser(mockResponse.user);
        setToken(mockResponse.token);
        
        // Store user data and token
        await AsyncStorage.setItem('userData', JSON.stringify(mockResponse.user));
        await storeToken(mockResponse.token);
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      const mockResponse = {
        success: true,
        user: {
          id: Date.now(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: 'customer',
          avatar: null,
          preferences: {
            notifications: true,
            language: 'en',
            theme: 'light',
          },
        },
        token: 'mock_jwt_token_' + Date.now(),
      };

      if (mockResponse.success) {
        setUser(mockResponse.user);
        setToken(mockResponse.token);
        
        // Store user data and token
        await AsyncStorage.setItem('userData', JSON.stringify(mockResponse.user));
        await storeToken(mockResponse.token);
        
        return { success: true };
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear stored data
      await AsyncStorage.removeItem('userData');
      await removeToken();
      
      // Clear state
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      // TODO: Replace with actual API call
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};