import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  userName: string;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onNavigate, onLogout }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.logoText}>Shaka Bank</Text>
        <TouchableOpacity onPress={() => onNavigate('profile')}>
          <FontAwesome name="user-circle" size={28} color="#333" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.welcomeText}>Hello, {userName}</Text>
      
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => onNavigate('dashboard')}
        >
          <FontAwesome name="home" size={20} color="#1A5FB4" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => onNavigate('account')}
        >
          <FontAwesome name="wallet" size={20} color="#1A5FB4" />
          <Text style={styles.navText}>Accounts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => onNavigate('transfer')}
        >
          <FontAwesome name="exchange-alt" size={20} color="#1A5FB4" />
          <Text style={styles.navText}>Transfer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => onNavigate('bills')}
        >
          <FontAwesome name="file-invoice-dollar" size={20} color="#1A5FB4" />
          <Text style={styles.navText}>Bills</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A5FB4',
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
});

export default Header;