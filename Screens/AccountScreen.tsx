import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Account, ScreenType } from '../types';

interface AccountScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ onNavigate }) => {
  const accounts: Account[] = [
    { id: '1', name: 'Primary Checking', type: 'checking', accountNumber: '4321', balance: 18245.67, availableBalance: 18245.67, currency: 'USD' },
    { id: '2', name: 'Savings Account', type: 'savings', accountNumber: '8765', balance: 6322.22, availableBalance: 6322.22, currency: 'USD' },
    { id: '3', name: 'Investment Account', type: 'investment', accountNumber: '9876', balance: 45890.45, availableBalance: 45890.45, currency: 'USD' },
  ];

  const accountServices = [
    { icon: 'file-download', label: 'Download Statement' },
    { icon: 'credit-card', label: 'Order New Card' },
    { icon: 'unlock-alt', label: 'Security Settings' },
    { icon: 'percentage', label: 'Interest Rates' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="wallet" size={24} color="#1A5FB4" />
        <Text style={styles.title}> Account Details</Text>
      </View>

      <View style={styles.accountsGrid}>
        {accounts.map((account) => (
          <View key={account.id} style={styles.accountCard}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountNumber}>XXXX-XXXX-XXXX-{account.accountNumber}</Text>
            <Text style={styles.accountBalance}>{formatCurrency(account.balance)}</Text>
            <Text style={styles.availableLabel}>Available Balance</Text>
            <TouchableOpacity style={styles.viewStatementButton}>
              <Text style={styles.viewStatementText}>View Statement</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.servicesCard}>
        <Text style={styles.cardTitle}>Account Services</Text>
        <View style={styles.servicesGrid}>
          {accountServices.map((service, index) => (
            <TouchableOpacity key={index} style={styles.serviceItem}>
              <View style={styles.serviceIcon}>
                <FontAwesome name={service.icon as any} size={24} color="#1A5FB4" />
              </View>
              <Text style={styles.serviceLabel}>{service.label}</Text>
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
  accountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  accountCard: {
    width: '100%',
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
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  accountNumber: {
    fontFamily: 'monospace',
    fontSize: 16,
    letterSpacing: 1,
    color: '#666',
    marginBottom: 12,
  },
  accountBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A5FB4',
    marginBottom: 4,
  },
  availableLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  viewStatementButton: {
    borderWidth: 1,
    borderColor: '#1A5FB4',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewStatementText: {
    color: '#1A5FB4',
    fontSize: 16,
    fontWeight: '600',
  },
  servicesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
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
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
});

export default AccountScreen;