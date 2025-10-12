import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Snackbar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../themes/ThemeContext';
import { useAuth } from '../../services/AuthContext';

const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setSnackbarMessage('Please fill in all fields');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    
    if (!result.success) {
      setSnackbarMessage(result.error || 'Login failed');
      setSnackbarVisible(true);
    }
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      justifyContent: 'center',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    card: {
      padding: theme.spacing.lg,
      margin: theme.spacing.md,
      borderRadius: theme.layout.borderRadius,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    logoImage: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      opacity: 0.9,
    },
    cardTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      color: theme.colors.primary,
    },
    input: {
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    loginButton: {
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    linkButton: {
      marginTop: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.lg,
    },
    footerText: {
      color: theme.colors.onSurface,
    },
    linkText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.title}>SalonShop</Text>
          <Text style={styles.subtitle}>Welcome back! Sign in to continue</Text>
          
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Sign In</Text>
              
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
              >
                Sign In
              </Button>
              
              <Button
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.linkButton}
              >
                Forgot Password?
              </Button>
              
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Text 
                  style={styles.linkText}
                  onPress={() => navigation.navigate('Register')}
                >
                  Sign Up
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ImageBackground>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;