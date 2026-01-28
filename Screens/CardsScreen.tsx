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
import { ScreenType } from '../../types';

interface CardsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

interface Card {
  id: string;
  type: 'Visa' | 'Mastercard';
  lastFour: string;
  name: string;
  expiry: string;
  isActive: boolean;
  balance: number;
  color: string;
}

const CardsScreen: React.FC<CardsScreenProps> = ({ onNavigate }) => {
  const [cards, setCards] = useState<Card[]>([
    { id: '1', type: 'Visa', lastFour: '4321', name: 'John Smith', expiry: '06/25', isActive: true, balance: 2450.75, color: '#1A5FB4' },
    { id: '2', type: 'Mastercard', lastFour: '8765', name: 'John Smith', expiry: '09/24', isActive: true, balance: 500.00, color: '#e74c3c' },
    { id: '3', type: 'Visa', lastFour: '1234', name: 'John Smith', expiry: '12/23', isActive: false, balance: 0.00, color: '#2ecc71' },
  ]);

  const [cardSettings, setCardSettings] = useState({
    onlineTransactions: true,
    contactlessPayments: true,
    internationalPayments: false,
    atmWithdrawals: true,
  });

  const toggleCardActive = (cardId: string) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isActive: !card.isActive } : card
      )
    );
  };

  const toggleCardSetting = (setting: keyof typeof cardSettings) => {
    setCardSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleFreezeCard = (cardId: string) => {
    toggleCardActive(cardId);
    alert(cards.find(c => c.id === cardId)?.isActive ? 'Card frozen' : 'Card activated');
  };

  const handleReportLost = (cardId: string) => {
    alert('Card reported as lost/stolen. A new card will be issued.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>My Cards</Text>
      </View>

      <View style={styles.cardGrid}>
        {cards.map((card) => (
          <View key={card.id} style={[styles.cardContainer, { backgroundColor: card.color }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>{card.type}</Text>
              <View style={styles.cardStatus}>
                <View style={[styles.statusDot, card.isActive ? styles.activeDot : styles.inactiveDot]} />
                <Text style={styles.statusText}>{card.isActive ? 'Active' : 'Frozen'}</Text>
              </View>
            </View>
            
            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFour}</Text>
            </View>
            
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardholderLabel}>CARDHOLDER</Text>
                <Text style={styles.cardholderName}>{card.name}</Text>
              </View>
              <View>
                <Text style={styles.expiryLabel}>EXPIRY</Text>
                <Text style={styles.expiryDate}>{card.expiry}</Text>
              </View>
            </View>
            
            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={[styles.cardActionButton, !card.isActive && styles.frozenButton]}
                onPress={() => handleFreezeCard(card.id)}
              >
                <FontAwesome 
                  name={card.isActive ? 'snowflake' : 'fire'} 
                  size={16} 
                  color={card.isActive ? card.color : '#fff'} 
                />
                <Text style={[styles.cardActionText, !card.isActive && styles.frozenButtonText]}>
                  {card.isActive ? 'Freeze' : 'Activate'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cardActionButton}
                onPress={() => handleReportLost(card.id)}
              >
                <FontAwesome name="exclamation-triangle" size={16} color="#fff" />
                <Text style={styles.cardActionText}>Report</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardBalance}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(card.balance)}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.newCardButton}>
        <FontAwesome name="plus-circle" size={20} color="#1A5FB4" />
        <Text style={styles.newCardText}> Request New Card</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Card Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <FontAwesome name="globe" size={20} color="#333" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Online Transactions</Text>
              <Text style={styles.settingDescription}>Allow online purchases</Text>
            </View>
          </View>
          <Switch
            value={cardSettings.onlineTransactions}
            onValueChange={() => toggleCardSetting('onlineTransactions')}
            trackColor={{ false: '#ddd', true: '#1A5FB4' }}
            thumbColor="white"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <FontAwesome name="wifi" size={20} color="#333" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Contactless Payments</Text>
              <Text style={styles.settingDescription}>Tap to pay with NFC</Text>
            </View>
          </View>
          <Switch
            value={cardSettings.contactlessPayments}
            onValueChange={() => toggleCardSetting('contactlessPayments')}
            trackColor={{ false: '#ddd', true: '#1A5FB4' }}
            thumbColor="white"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <FontAwesome name="plane" size={20} color="#333" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>International Payments</Text>
              <Text style={styles.settingDescription}>Allow foreign transactions</Text>
            </View>
          </View>
          <Switch
            value={cardSettings.internationalPayments}
            onValueChange={() => toggleCardSetting('internationalPayments')}
            trackColor={{ false: '#ddd', true: '#1A5FB4' }}
            thumbColor="white"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <FontAwesome name="money-bill-wave" size={20} color="#333" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>ATM Withdrawals</Text>
              <Text style={styles.settingDescription}>Allow cash withdrawals</Text>
            </View>
          </View>
          <Switch
            value={cardSettings.atmWithdrawals}
            onValueChange={() => toggleCardSetting('atmWithdrawals')}
            trackColor={{ false: '#ddd', true: '#1A5FB4' }}
            thumbColor="white"
          />
        </View>
      </View>

      <View style={styles.transactionsCard}>
        <Text style={styles.cardTitle}>Recent Card Transactions</Text>
        {[
          { id: '1', merchant: 'Amazon', amount: -89.50, date: 'Today', category: 'Shopping' },
          { id: '2', merchant: 'Starbucks', amount: -5.75, date: 'Yesterday', category: 'Food' },
          { id: '3', merchant: 'Netflix', amount: -15.99, date: '2 days ago', category: 'Entertainment' },
          { id: '4', merchant: 'Apple Store', amount: -1299.00, date: '1 week ago', category: 'Electronics' },
        ].map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
              <Text style={styles.transactionCategory}>{transaction.category} • {transaction.date}</Text>
            </View>
            <Text style={[styles.transactionAmount, transaction.amount < 0 ? styles.negativeAmount : styles.positiveAmount]}>
              {formatCurrency(transaction.amount)}
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
  cardGrid: {
    marginBottom: 20,
  },
  cardContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: '#2ecc71',
  },
  inactiveDot: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardNumberContainer: {
    marginBottom: 30,
  },
  cardNumber: {
    fontSize: 24,
    letterSpacing: 2,
    color: 'white',
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardholderLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  cardholderName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  expiryLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
    textAlign: 'right',
  },
  expiryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  frozenButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  frozenButtonText: {
    color: '#333',
  },
  cardBalance: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  newCardButton: {
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
  newCardText: {
    color: '#1A5FB4',
    fontSize: 16,
    fontWeight: '600',
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  transactionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  negativeAmount: {
    color: '#e74c3c',
  },
  positiveAmount: {
    color: '#2ecc71',
  },
});

export default CardsScreen;