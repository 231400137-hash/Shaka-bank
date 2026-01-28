import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenType } from '../../types';

interface SendMoneyScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
}

const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const contacts: Contact[] = [
    { id: '1', name: 'Jane Doe', phone: '+1 (555) 123-4567', avatar: 'JD' },
    { id: '2', name: 'Robert Brown', phone: '+1 (555) 987-6543', avatar: 'RB' },
    { id: '3', name: 'Sarah Johnson', phone: '+1 (555) 456-7890', avatar: 'SJ' },
    { id: '4', name: 'Mike Wilson', phone: '+1 (555) 234-5678', avatar: 'MW' },
    { id: '5', name: 'Emily Davis', phone: '+1 (555) 876-5432', avatar: 'ED' },
    { id: '6', name: 'John Smith', phone: '+1 (555) 345-6789', avatar: 'JS' },
  ];

  const recentTransactions = [
    { id: '1', to: 'Jane Doe', amount: 50.00, date: 'Today', status: 'completed' },
    { id: '2', to: 'Electricity Co.', amount: 85.30, date: 'Yesterday', status: 'completed' },
    { id: '3', to: 'Netflix', amount: 15.99, date: '2 days ago', status: 'completed' },
  ];

  const handleSendMoney = () => {
    if (!amount || !selectedContact) {
      alert('Please enter amount and select a contact');
      return;
    }
    alert(`Successfully sent $${amount} to ${contacts.find(c => c.id === selectedContact)?.name}`);
    setAmount('');
    setSelectedContact(null);
    setNote('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedContact === item.id && styles.contactItemSelected,
      ]}
      onPress={() => setSelectedContact(item.id)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      {selectedContact === item.id && (
        <FontAwesome name="check-circle" size={20} color="#1A5FB4" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Send Money</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Recipient</Text>
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          numColumns={2}
          columnWrapperStyle={styles.contactsGrid}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transfer Details</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note for the recipient"
            value={note}
            onChangeText={setNote}
            placeholderTextColor="#999"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
          <FontAwesome name="paper-plane" size={20} color="white" />
          <Text style={styles.sendButtonText}> Send Money</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTo}>To: {transaction.to}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={styles.transactionAmount}>
              -{formatCurrency(transaction.amount)}
            </Text>
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
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  contactsGrid: {
    justifyContent: 'space-between',
  },
  contactItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  contactItemSelected: {
    borderColor: '#1A5FB4',
    backgroundColor: 'rgba(26, 95, 180, 0.05)',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A5FB4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 12,
    color: '#666',
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#1A5FB4',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
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
  transactionTo: {
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
    color: '#e74c3c',
  },
});

export default SendMoneyScreen;