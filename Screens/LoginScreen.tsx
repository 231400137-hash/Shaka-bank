import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenType } from '../types';

interface LoginScreenProps {
  onLogin: (userData?: any) => void;
  onNavigate: (screen: ScreenType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Demo credentials for quick access
  const DEMO_CREDENTIALS = {
    email: 'demo@shakabank.com',
    password: 'password123'
  };

  const handleQuickDemoLogin = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    
    // Simulate a brief delay and then login
    setLoading(true);
    setTimeout(() => {
      performLogin(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    }, 500);
  };

  const performLogin = (userEmail: string, userPassword: string) => {
    // Create demo user data
    const demoUserData = {
      uid: 'demo_user_' + Date.now(),
      email: userEmail,
      fullName: 'Demo User',
      phone: '+1 (555) 123-4567',
      memberSince: 'January 2024',
      accounts: {
        checking: {
          accountNumber: '4321',
          balance: 18245.67,
          currency: 'USD',
        },
        savings: {
          accountNumber: '8765',
          balance: 6322.22,
          currency: 'USD',
        },
      },
      lastLogin: new Date().toISOString(),
    };

    // Call the parent's onLogin function with demo data
    onLogin(demoUserData);
    
    // Show success message
    Alert.alert('Success', 'Login successful! Welcome to Shaka Bank.');
    
    setLoading(false);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your email');
      return;
    }
    
    if (!password) {
      Alert.alert('Required', 'Please enter your password');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In demo mode, accept any valid email format and any password
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      performLogin(email, password);
    }, 1000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'In the demo version, use:\n\nEmail: demo@shakabank.com\nPassword: password123\n\nOr enter any valid email format.',
      [
        { text: 'Use Demo', onPress: handleQuickDemoLogin },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const handleRegisterNavigation = () => {
    onNavigate('register');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <View style={styles.card}>
          <View style={styles.authHeader}>
            <View style={styles.logo}>
              <FontAwesome name="university" size={32} color="#1A5FB4" />
              <Text style={styles.logoText}>Shaka Bank</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Please login to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                autoComplete="email"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                autoComplete="password"
              />
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.checkboxContainer, loading && styles.disabled]}
                onPress={() => !loading && setRememberMe(!rememberMe)}
                disabled={loading}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <FontAwesome name="check" size={12} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
                <Text style={[styles.forgotPassword, loading && styles.disabled]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <FontAwesome name="sign-in-alt" size={20} color="white" />
                  <Text style={styles.buttonText}> Login</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Quick Demo Login Button */}
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={handleQuickDemoLogin}
              disabled={loading}
            >
              <FontAwesome name="rocket" size={16} color="#1A5FB4" />
              <Text style={styles.demoButtonText}> Quick Demo Login</Text>
            </TouchableOpacity>

            {/* Demo Hint */}
            <View style={styles.demoHintContainer}>
              <Text style={styles.demoHint}>
                💡 Demo: Use any valid email format (user@example.com) and any password
              </Text>
            </View>
          </View>

          <View style={styles.authFooter}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text 
                style={[styles.link, loading && styles.disabled]} 
                onPress={handleRegisterNavigation}
              >
                Register here
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1A5FB4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A5FB4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#1A5FB4',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1A5FB4',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  forgotPassword: {
    color: '#1A5FB4',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#1A5FB4',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  authFooter: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#1A5FB4',
    fontWeight: '600',
  },
});

export default LoginScreen;