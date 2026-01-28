import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { ScreenType } from './types';
import SplashScreen from './Screens/SplashScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import DashboardScreen from './Screens/DashboardScreen';
import AccountScreen from './Screens/AccountScreen';
import TransferScreen from './Screens/TransferScreen';
import BillsScreen from './Screens/BillsScreen';
import ProfileScreen from './Screens/ProfileScreen';
import SendMoneyScreen from './Screens/SendMoneyScreen';
import MobileTopupScreen from './Screens/MobileTopupScreen';
import InvestScreen from './Screens/InvestScreen';
import CardsScreen from './Screens/CardsScreen';
import TransactionsScreen from './Screens/TransactionsScreen';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import ChatBot from './layouts/ChatBot';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    memberSince: 'January 2018',
  });

  useEffect(() => {
    // Handle authentication state based on current screen
    if (currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'register') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [currentScreen]);

  const handleLogin = () => {
    // In a real app, you would validate credentials here
    setCurrentScreen('dashboard');
    Alert.alert('Success', 'Login successful!');
  };

  const handleRegister = () => {
    // In a real app, you would register the user here
    setCurrentScreen('login');
    Alert.alert('Success', 'Registration successful! Please login.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
    Alert.alert('Logged Out', 'You have been logged out successfully.');
  };

  const handlePayBill = (billId: string) => {
    Alert.alert('Payment Success', `Bill ${billId} paid successfully!`);
    // In a real app, you would update the bill status here
  };

  const handleTransferComplete = () => {
    Alert.alert('Transfer Initiated', 'Transfer has been initiated successfully!');
    // In a real app, you would navigate back or show confirmation
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterScreen onRegister={handleRegister} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardScreen userName={user.name} onNavigate={handleNavigate} />;
      case 'account':
        return <AccountScreen onNavigate={handleNavigate} />;
      case 'transfer':
        return <TransferScreen onTransferComplete={handleTransferComplete} />;
      case 'bills':
        return <BillsScreen onPayBill={handlePayBill} />;
      case 'profile':
        return <ProfileScreen user={user} />;
      case 'sendmoney':
        return <SendMoneyScreen onNavigate={handleNavigate} />;
      case 'mobiletopup':
        return <MobileTopupScreen onNavigate={handleNavigate} />;
      case 'invest':
        return <InvestScreen onNavigate={handleNavigate} />;
      case 'cards':
        return <CardsScreen onNavigate={handleNavigate} />;
      case 'transactions':
        return <TransactionsScreen onNavigate={handleNavigate} />;
      default:
        return <DashboardScreen userName={user.name} onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {isLoggedIn ? (
        <View style={styles.container}>
          <Header 
            currentScreen={currentScreen} 
            userName={user.name} 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
          <View style={styles.content}>
            {renderScreen()}
          </View>
          <Footer />
          <ChatBot />
        </View>
      ) : (
        <View style={styles.fullScreen}>
          {renderScreen()}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
});

export default App;