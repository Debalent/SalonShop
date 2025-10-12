import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../themes/ThemeContext';
import Logo from '../../components/Logo';

const { height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
    },
    content: {
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 42,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 18,
      color: '#fff',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      opacity: 0.9,
      lineHeight: 24,
    },
    tagline: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
      marginBottom: theme.spacing.xxl,
      opacity: 0.8,
      fontStyle: 'italic',
    },
    buttonContainer: {
      width: '100%',
      gap: theme.spacing.md,
    },
    signInButton: {
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.layout.borderRadius,
    },
    signUpButton: {
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.layout.borderRadius,
      borderColor: '#fff',
      borderWidth: 2,
    },
    signUpButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Logo 
              size="large" 
              style={{ marginBottom: theme.spacing.sm }}
            />
            <Text style={styles.title}>SalonShop</Text>
          </View>
          <Text style={styles.subtitle}>
            Your beauty, our passion.{'\n'}
            Book appointments with ease.
          </Text>
          <Text style={styles.tagline}>
            "Where every service tells a story"
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.signInButton}
              contentStyle={{ paddingVertical: 8 }}
            >
              Sign In
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={styles.signUpButton}
              labelStyle={styles.signUpButtonText}
              contentStyle={{ paddingVertical: 8 }}
            >
              Create Account
            </Button>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;