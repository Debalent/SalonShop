import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../themes/ThemeContext';
import Logo from '../components/Logo';

const SplashScreen = () => {
  const { theme } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    background: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      flex: 1,
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    tagline: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      opacity: 0.9,
      fontStyle: 'italic',
    },
    loadingContainer: {
      marginTop: theme.spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      color: '#fff',
      marginTop: theme.spacing.sm,
      opacity: 0.8,
    },
  });

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Logo 
            size="medium" 
            style={{ marginBottom: theme.spacing.sm }}
          />
          <Text style={styles.logo}>SalonShop</Text>
          <Text style={styles.tagline}>Your beauty, our passion</Text>
        </Animated.View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;