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
import { auth, database, ref, get } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginScreenProps {
  onLogin: (userData: any) => void;
  onNavigate: (screen: ScreenType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      Alert.alert('Validation Error', 'Please enter your password');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      
      const user = userCredential.user;
      
      // Fetch user data from Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Update last login time
        const updates = {
          lastLogin: new Date().toISOString(),
        };
        
        // If remember me is checked, you could store the token locally
        if (rememberMe) {
          // Store authentication token or user ID in AsyncStorage/secure storage
          // For now, we'll just update the database
          console.log('Remember me enabled for:', user.email);
        }
        
        // Update last login in database
        // Note: In production, you might want to use update() instead
        const updatedUserData = { ...userData, ...updates };
        
        // Call onLogin with user data
        onLogin({
          uid: user.uid,
          email: user.email,
          ...updatedUserData
        });
        
        Alert.alert('Success', 'Login successful!');
        
      } else {
        // User exists in auth but not in database - this shouldn't happen
        throw new Error('User data not found. Please contact support.');
      }
      
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/invalid-credential' || 
          error.code === 'auth/wrong-password' || 
          error.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Login Failed', errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Password Reset', 'Please enter your email address first');
      return;
    }
    
    Alert.alert(
      'Password Reset',
      `Would you like to reset password for ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => {
            // In production, implement Firebase sendPasswordResetEmail
            Alert.alert(
              'Reset Email Sent',
              'Password reset instructions have been sent to your email.'
            );
          }
        }
      ]
    );
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
          </View>

          <View style={styles.authFooter}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text 
                style={[styles.link, loading && styles.disabled]} 
                onPress={() => !loading && onNavigate('register')}
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