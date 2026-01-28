import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Transaction, ScreenType } from '../types';

// ADD onNavigate prop to the interface
interface DashboardScreenProps {
  userName: string;
  onNavigate: (screen: ScreenType) => void; // ADD THIS LINE
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ userName, onNavigate }) => { // ADD onNavigate here
  const transactions: Transaction[] = [
    { id: '1', description: 'Netflix Subscription', amount: -15.99, date: 'June 15, 2023', type: 'debit', category: 'Entertainment', status: 'completed' },
    { id: '2', description: 'Salary Deposit', amount: 3500.00, date: 'June 14, 2023', type: 'credit', category: 'Income', status: 'completed' },
    { id: '3', description: 'Amazon Purchase', amount: -89.50, date: 'June 12, 2023', type: 'debit', category: 'Shopping', status: 'completed' },
    { id: '4', description: 'Transfer to Jane Doe', amount: -200.00, date: 'June 10, 2023', type: 'debit', category: 'Transfer', status: 'completed' },
  ];

  // UPDATE quickActions to include screen navigation
  const quickActions = [
    { icon: 'paper-plane', label: 'Send Money', screen: 'sendmoney' as ScreenType },
    { icon: 'file-invoice-dollar', label: 'Pay Bills', screen: 'bills' as ScreenType },
    { icon: 'mobile-alt', label: 'Mobile Top-up', screen: 'mobiletopup' as ScreenType },
    { icon: 'chart-line', label: 'Invest', screen: 'invest' as ScreenType },
    { icon: 'credit-card', label: 'Cards', screen: 'cards' as ScreenType },
    { icon: 'history', label: 'Transactions', screen: 'transactions' as ScreenType },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, item.amount >= 0 ? styles.positive : styles.negative]}>
        {item.amount >= 0 ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </View>
  );

  // UPDATE renderQuickAction to use onNavigate
  const renderQuickAction = (action: { icon: string; label: string; screen: ScreenType }, index: number) => (
    <TouchableOpacity 
      key={index} 
      style={styles.quickAction}
      onPress={() => onNavigate(action.screen)} // ADD onPress handler
    >
      <View style={styles.quickActionIcon}>
        <FontAwesome name={action.icon as any} size={24} color="#1A5FB4" />
      </View>
      <Text style={styles.quickActionLabel}>{action.label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="home" size={24} color="#1A5FB4" />
        <Text style={styles.title}> Welcome back, {userName}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Total Balance</Text>
          <TouchableOpacity>
            <FontAwesome name="eye" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceAmount}>$24,567.89</Text>
        <Text style={styles.accountInfo}>Primary Checking Account •••• 4321</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(renderQuickAction)} {/* This now uses onNavigate */}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

// Keep the same styles...
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A5FB4',
    marginBottom: 8,
  },
  accountInfo: {
    fontSize: 14,
    color: '#999',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickAction: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: '#2ecc71',
  },
  negative: {
    color: '#e74c3c',
  },
});

export default DashboardScreen;