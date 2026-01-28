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
// TODO: Uncomment when implementing Firebase
// import { database, ref, set } from '../firebaseConfig';

interface RegisterScreenProps {
  onRegister: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!formData.phone.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }
    
    if (!formData.password) {
      Alert.alert('Validation Error', 'Please create a password');
      return false;
    }
    
    if (formData.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match!');
      return false;
    }
    
    if (!formData.agreeTerms) {
      Alert.alert('Validation Error', 'You must agree to the terms and conditions');
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
      // TODO: Uncomment when implementing Firebase
      /*
      // Generate a unique ID for the user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user data object
      const userData = {
        id: userId,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        accounts: {
          checking: {
            accountNumber: `CHK${Math.floor(10000000 + Math.random() * 90000000)}`,
            balance: 1000.00,
            currency: 'USD',
            createdAt: new Date().toISOString(),
          },
          savings: {
            accountNumber: `SAV${Math.floor(10000000 + Math.random() * 90000000)}`,
            balance: 500.00,
            currency: 'USD',
            createdAt: new Date().toISOString(),
          }
        },
        status: 'active',
        termsAccepted: true,
        termsAcceptedDate: new Date().toISOString(),
      };

      // Save to Firebase Realtime Database
      await set(ref(database, `users/${userId}`), userData);

      // Also save to a separate emails collection for easy lookup
      await set(ref(database, `userEmails/${formData.email.trim().toLowerCase()}`), {
        userId: userId,
        fullName: formData.fullName.trim(),
      });
      */

      // TEMPORARY: Mock registration for demo purposes
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Demo Mode',
          'Account created successfully! (Demo mode)\n\nPlease login with your credentials.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
                  agreeTerms: false,
                });
                // Navigate to login
                onNavigate('login');
                // Call onRegister if needed
                onRegister();
              }
            }
          ]
        );
      }, 1500);

    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'An error occurred during registration. Please try again.'
      );
      setLoading(false);
    }
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Shaka Bank today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(value) => handleChange('fullName', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                autoComplete="email"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
                editable={!loading}
              />
              <Text style={styles.helperText}>Minimum 6 characters</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={[styles.checkboxContainer, loading && styles.disabled]}
                onPress={() => !loading && handleChange('agreeTerms', !formData.agreeTerms)}
                disabled={loading}
              >
                <View style={[styles.checkbox, formData.agreeTerms && styles.checkboxChecked]}>
                  {formData.agreeTerms && <FontAwesome name="check" size={12} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
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
                  <FontAwesome name="user-plus" size={20} color="white" />
                  <Text style={styles.buttonText}> Create Account</Text>
                </>
              )}
            </TouchableOpacity>

            {loading && (
              <Text style={styles.loadingText}>
                Creating your account and setting up your banking profile... (Demo mode)
              </Text>
            )}
            
            {/* Demo note */}
            {!loading && (
              <Text style={styles.demoNote}>
                Note: This is a demo. No real account will be created.
              </Text>
            )}
          </View>

          <View style={styles.authFooter}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={[styles.link, loading && styles.disabled]} onPress={() => !loading && onNavigate('login')}>
                Login here
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#1A5FB4',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#1A5FB4',
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#1A5FB4',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1A5FB4',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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

export default RegisterScreen;