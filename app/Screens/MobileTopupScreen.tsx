import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenType } from '../../types';

interface MobileTopupScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const MobileTopupScreen: React.FC<MobileTopupScreenProps> = ({ onNavigate }) => {
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [selectedProvider, setSelectedProvider] = useState('verizon');
  const [amount, setAmount] = useState('20');
  const [promoCode, setPromoCode] = useState('');

  const providers = [
    { id: 'verizon', name: 'Verizon', color: '#cd040b' },
    { id: 'att', name: 'AT&T', color: '#00a8e0' },
    { id: 'tmobile', name: 'T-Mobile', color: '#e20074' },
    { id: 'sprint', name: 'Sprint', color: '#ffde00' },
  ];

  const presetAmounts = [10, 20, 30, 50, 75, 100];

  const handleTopup = () => {
    if (!phoneNumber || !amount) {
      alert('Please enter phone number and amount');
      return;
    }
    const providerName = providers.find(p => p.id === selectedProvider)?.name;
    alert(`Successfully topped up $${amount} to ${phoneNumber} (${providerName})`);
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mobile Top-up</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Phone Number</Text>
        <View style={styles.phoneInputContainer}>
          <FontAwesome name="phone" size={20} color="#666" style={styles.phoneIcon} />
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Provider</Text>
        <View style={styles.providersGrid}>
          {providers.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.providerCard,
                selectedProvider === provider.id && { borderColor: provider.color, backgroundColor: `${provider.color}10` },
              ]}
              onPress={() => handleProviderSelect(provider.id)}
            >
              <View style={[styles.providerIcon, { backgroundColor: provider.color }]}>
                <FontAwesome name="sim-card" size={20} color="white" />
              </View>
              <Text style={styles.providerName}>{provider.name}</Text>
              {selectedProvider === provider.id && (
                <FontAwesome name="check-circle" size={16} color={provider.color} style={styles.providerCheck} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Amount</Text>
        <View style={styles.amountsGrid}>
          {presetAmounts.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[
                styles.amountButton,
                amount === amt.toString() && styles.amountButtonSelected,
              ]}
              onPress={() => setAmount(amt.toString())}
            >
              <Text style={[styles.amountText, amount === amt.toString() && styles.amountTextSelected]}>
                ${amt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.customAmountContainer}>
          <Text style={styles.customAmountLabel}>Or enter custom amount:</Text>
          <View style={styles.customAmountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.customAmountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Promo Code (Optional)</Text>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter promo code"
          value={promoCode}
          onChangeText={setPromoCode}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.topupButton} onPress={handleTopup}>
        <FontAwesome name="bolt" size={20} color="white" />
        <Text style={styles.topupButtonText}> Top Up Now</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <FontAwesome name="info-circle" size={20} color="#1A5FB4" style={styles.infoIcon} />
        <Text style={styles.infoText}>
          Top-ups are processed instantly. The amount will be deducted from your primary account.
          Standard carrier charges may apply.
        </Text>
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  phoneIcon: {
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    paddingVertical: 12,
  },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  providerCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  providerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  providerCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  amountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountButton: {
    width: '30%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  amountButtonSelected: {
    borderColor: '#1A5FB4',
    backgroundColor: 'rgba(26, 95, 180, 0.05)',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amountTextSelected: {
    color: '#1A5FB4',
  },
  customAmountContainer: {
    marginTop: 10,
  },
  customAmountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  customAmountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  customAmountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 12,
  },
  promoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  topupButton: {
    backgroundColor: '#1A5FB4',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  topupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 95, 180, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1A5FB4',
    lineHeight: 20,
  },
});

export default MobileTopupScreen;