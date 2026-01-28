import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Picker,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Recipient, Transaction } from '../types';

interface TransferScreenProps {
  onTransferComplete: () => void;
}

const TransferScreen: React.FC<TransferScreenProps> = ({ onTransferComplete }) => {
  const [transferData, setTransferData] = useState({
    fromAccount: 'primary',
    toRecipient: 'jane',
    amount: '',
    description: '',
    transferDate: 'now',
  });

  const recipients: Recipient[] = [
    { id: 'jane', name: 'Jane Doe', accountNumber: '5678', bank: 'Shaka Bank', avatar: 'JD' },
    { id: 'robert', name: 'Robert Brown', accountNumber: '1234', bank: 'Other Bank', avatar: 'RB' },
  ];

  const recentTransfers: Transaction[] = [
    { id: '1', description: 'To: Jane Doe', amount: -200.00, date: 'June 10, 2023', type: 'debit', category: 'Transfer', status: 'completed' },
    { id: '2', description: 'To: Electricity Co.', amount: -85.30, date: 'June 5, 2023', type: 'debit', category: 'Bill', status: 'completed' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setTransferData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Transfer data:', transferData);
    alert('Transfer initiated successfully!');
    onTransferComplete();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="exchange-alt" size={24} color="#1A5FB4" />
        <Text style={styles.title}> Fund Transfer</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transfer Funds</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>From Account</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={transferData.fromAccount}
              onValueChange={(value) => handleInputChange('fromAccount', value)}
              style={styles.picker}
            >
              <Picker.Item label="Primary Checking (•••• 4321) - $18,245.67" value="primary" />
              <Picker.Item label="Savings Account (•••• 8765) - $6,322.22" value="savings" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>To Account</Text>
          <View style={styles.recipientOptions}>
            {recipients.map((recipient) => (
              <TouchableOpacity
                key={recipient.id}
                style={[
                  styles.recipientOption,
                  transferData.toRecipient === recipient.id && styles.recipientOptionActive,
                ]}
                onPress={() => handleInputChange('toRecipient', recipient.id)}
              >
                <FontAwesome name="user" size={24} color="#1A5FB4" />
                <Text style={styles.recipientName}>{recipient.name}</Text>
                <Text style={styles.recipientAccount}>•••• {recipient.accountNumber}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.recipientOption}>
              <FontAwesome name="plus" size={24} color="#1A5FB4" />
              <Text style={styles.recipientName}>New Recipient</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={transferData.amount}
            onChangeText={(value) => handleInputChange('amount', value)}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dinner payment"
            value={transferData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Transfer Date</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={transferData.transferDate}
              onValueChange={(value) => handleInputChange('transferDate', value)}
              style={styles.picker}
            >
              <Picker.Item label="Transfer Now" value="now" />
              <Picker.Item label="Schedule for Later" value="later" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <FontAwesome name="paper-plane" size={20} color="white" />
          <Text style={styles.buttonText}> Transfer Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transfers</Text>
        {recentTransfers.map((transfer) => (
          <View key={transfer.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDescription}>{transfer.description}</Text>
              <Text style={styles.transactionDate}>{transfer.date} • Completed</Text>
            </View>
            <Text style={styles.transactionAmountNegative}>
              -{formatCurrency(transfer.amount)}
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  recipientOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipientOption: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  recipientOptionActive: {
    borderColor: '#1A5FB4',
    backgroundColor: 'rgba(26, 95, 180, 0.05)',
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  recipientAccount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
  transactionAmountNegative: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
});

export default TransferScreen;