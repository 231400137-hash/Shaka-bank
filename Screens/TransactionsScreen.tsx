import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenType, Transaction } from '../../types';

interface TransactionsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const transactions: Transaction[] = [
    { id: '1', description: 'Netflix Subscription', amount: -15.99, date: 'June 15, 2023', type: 'debit', category: 'Entertainment', status: 'completed' },
    { id: '2', description: 'Salary Deposit', amount: 3500.00, date: 'June 14, 2023', type: 'credit', category: 'Income', status: 'completed' },
    { id: '3', description: 'Amazon Purchase', amount: -89.50, date: 'June 12, 2023', type: 'debit', category: 'Shopping', status: 'completed' },
    { id: '4', description: 'Transfer to Jane Doe', amount: -200.00, date: 'June 10, 2023', type: 'debit', category: 'Transfer', status: 'completed' },
    { id: '5', description: 'Electricity Bill', amount: -78.90, date: 'June 8, 2023', type: 'debit', category: 'Utilities', status: 'completed' },
    { id: '6', description: 'ATM Withdrawal', amount: -100.00, date: 'June 5, 2023', type: 'debit', category: 'Cash', status: 'completed' },
    { id: '7', description: 'Interest Earned', amount: 12.34, date: 'June 1, 2023', type: 'credit', category: 'Interest', status: 'completed' },
    { id: '8', description: 'Starbucks', amount: -5.75, date: 'May 28, 2023', type: 'debit', category: 'Food', status: 'completed' },
    { id: '9', description: 'Apple Music', amount: -9.99, date: 'May 25, 2023', type: 'debit', category: 'Entertainment', status: 'completed' },
    { id: '10', description: 'Freelance Payment', amount: 1200.00, date: 'May 20, 2023', type: 'credit', category: 'Income', status: 'completed' },
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'transfers', label: 'Transfers' },
    { id: 'bills', label: 'Bills' },
  ];

  const categories = [
    { id: 'shopping', label: 'Shopping', icon: 'shopping-bag', color: '#3498db' },
    { id: 'food', label: 'Food & Dining', icon: 'utensils', color: '#e74c3c' },
    { id: 'entertainment', label: 'Entertainment', icon: 'film', color: '#9b59b6' },
    { id: 'utilities', label: 'Utilities', icon: 'bolt', color: '#f39c12' },
    { id: 'transport', label: 'Transport', icon: 'car', color: '#1abc9c' },
    { id: 'health', label: 'Health', icon: 'heartbeat', color: '#e67e22' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return transaction.description.toLowerCase().includes(query) || 
             transaction.category.toLowerCase().includes(query);
    }
    
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'income') return transaction.amount > 0;
    if (selectedFilter === 'expenses') return transaction.amount < 0;
    if (selectedFilter === 'transfers') return transaction.category === 'Transfer';
    if (selectedFilter === 'bills') return transaction.category === 'Utilities';
    
    return true;
  });

  const calculateTotal = (type: 'income' | 'expenses') => {
    return filteredTransactions
      .filter(t => type === 'income' ? t.amount > 0 : t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.label.toLowerCase() === category.toLowerCase());
    return cat?.icon || 'receipt';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.label.toLowerCase() === category.toLowerCase());
    return cat?.color || '#95a5a6';
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(item.category)}20` }]}>
        <FontAwesome name={getCategoryIcon(item.category) as any} size={20} color={getCategoryColor(item.category)} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionMeta}>
          {formatDate(item.date)} • {item.category}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, item.amount >= 0 ? styles.positive : styles.negative]}>
        {item.amount >= 0 ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => {
        setSearchQuery(item.label);
        setSelectedFilter('all');
      }}
    >
      <View style={[styles.categoryIconLarge, { backgroundColor: `${item.color}20` }]}>
        <FontAwesome name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome name="times-circle" size={18} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={[styles.summaryAmount, styles.positive]}>
            +{formatCurrency(calculateTotal('income'))}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryAmount, styles.negative]}>
            -{formatCurrency(calculateTotal('expenses'))}
          </Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive,
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          numColumns={3}
          columnWrapperStyle={styles.categoriesGrid}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.cardTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="receipt" size={48} color="#ddd" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'No transactions for selected filter'}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.exportButton}>
        <FontAwesome name="file-export" size={20} color="#1A5FB4" />
        <Text style={styles.exportButtonText}> Export Statement</Text>
      </TouchableOpacity>
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
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  summaryCard: {
    flexDirection: 'row',
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
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  positive: {
    color: '#2ecc71',
  },
  negative: {
    color: '#e74c3c',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#1A5FB4',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
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
    marginBottom: 16,
  },
  categoriesGrid: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#1A5FB4',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  transactionMeta: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtonText: {
    color: '#1A5FB4',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TransactionsScreen;