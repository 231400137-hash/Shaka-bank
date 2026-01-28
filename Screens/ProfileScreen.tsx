import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ProfileScreenProps {
  user: {
    name: string;
    email: string;
    phone: string;
    memberSince: string;
  };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user }) => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginNotifications: true,
  });

  const preferences = [
    { icon: 'bell', label: 'Notifications' },
    { icon: 'language', label: 'Language' },
    { icon: 'palette', label: 'Theme' },
    { icon: 'question-circle', label: 'Help Center' },
  ];

  const handleSecurityToggle = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="user" size={24} color="#1A5FB4" />
        <Text style={styles.title}> My Profile</Text>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userType}>Premium Banking Customer</Text>
          <Text style={styles.memberSince}>Member since: {user.memberSince}</Text>
        </View>
      </View>

      <View style={styles.profileDetails}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{user.name}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{user.phone}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Information</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security Settings</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>••••••••</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Two-Factor Authentication</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </Text>
              <Switch
                value={securitySettings.twoFactorAuth}
                onValueChange={() => handleSecurityToggle('twoFactorAuth')}
                trackColor={{ false: '#ddd', true: '#1A5FB4' }}
                thumbColor="white"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Login Notifications</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {securitySettings.loginNotifications ? 'Enabled' : 'Disabled'}
              </Text>
              <Switch
                value={securitySettings.loginNotifications}
                onValueChange={() => handleSecurityToggle('loginNotifications')}
                trackColor={{ false: '#ddd', true: '#1A5FB4' }}
                thumbColor="white"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Security Center</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.preferencesCard}>
        <Text style={styles.cardTitle}>Preferences</Text>
        <View style={styles.preferencesGrid}>
          {preferences.map((pref, index) => (
            <TouchableOpacity key={index} style={styles.preferenceItem}>
              <View style={styles.preferenceIcon}>
                <FontAwesome name={pref.icon as any} size={24} color="#1A5FB4" />
              </View>
              <Text style={styles.preferenceLabel}>{pref.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1A5FB4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userType: {
    fontSize: 16,
    color: '#1A5FB4',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
  },
  profileDetails: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  readOnlyField: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#1A5FB4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#1A5FB4',
    fontSize: 16,
    fontWeight: '600',
  },
  preferencesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  preferenceItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  preferenceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default ProfileScreen;