import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Bill } from '../types';

interface BillsScreenProps {
  onPayBill: (billId: string) => void;
}

const BillsScreen: React.FC<BillsScreenProps> = ({ onPayBill }) => {
  const billCategories = [
    { icon: 'bolt', label: 'Electricity' },
    { icon: 'tint', label: 'Water' },
    { icon: 'wifi', label: 'Internet' },
    { icon: 'mobile-alt', label: 'Mobile' },
    { icon: 'tv', label: 'Cable TV' },
    { icon: 'credit-card', label: 'Credit Card' },
  ];

  const upcomingBills: Bill[] = [
    { id: '1', name: 'Electricity Bill', amount: 78.90, dueDate: 'June 25, 2023', category: 'Utilities', status: 'unpaid' },
    { id: '2', name: 'Internet Bill', amount: 65.00, dueDate: 'June 28, 2023', category: 'Internet', status: 'unpaid' },
    { id: '3', name: 'Mobile Phone', amount: 45.50, dueDate: 'July 1, 2023', category: 'Mobile', status: 'unpaid' },
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
        <FontAwesome name="file-invoice-dollar" size={24} color="#1A5FB4" />
        <Text style={styles.title}> Bills & Payments</Text>
      </View>

      <View style={styles.categoriesGrid}>
        {billCategories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryCard}>
            <View style={styles.categoryIcon}>
              <FontAwesome name={category.icon as any} size={32} color="#1A5FB4" />
            </View>
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.billsCard}>
        <Text style={styles.cardTitle}>Upcoming Bills</Text>
        {upcomingBills.map((bill) => (
          <View key={bill.id} style={styles.billItem}>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{bill.name}</Text>
              <Text style={styles.billDueDate}>Due: {bill.dueDate}</Text>
            </View>
            <View style={styles.billActions}>
              <Text style={styles.billAmount}>-{formatCurrency(bill.amount)}</Text>
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => onPayBill(bill.id)}
              >
                <Text style={styles.payButtonText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  billsCard: {
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
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  billDueDate: {
    fontSize: 12,
    color: '#999',
  },
  billActions: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 8,
  },
  payButton: {
    backgroundColor: '#1A5FB4',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  payButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BillsScreen;