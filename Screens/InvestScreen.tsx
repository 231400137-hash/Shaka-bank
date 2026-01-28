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

interface InvestScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

interface InvestmentOption {
  id: string;
  name: string;
  type: string;
  risk: 'Low' | 'Medium' | 'High';
  return: number;
  minimum: number;
  color: string;
}

const InvestScreen: React.FC<InvestScreenProps> = ({ onNavigate }) => {
  const [selectedOption, setSelectedOption] = useState<string>('1');
  const [amount, setAmount] = useState('1000');
  const [investmentPeriod, setInvestmentPeriod] = useState('12');

  const investmentOptions: InvestmentOption[] = [
    { id: '1', name: 'Savings Plus', type: 'Bonds', risk: 'Low', return: 3.5, minimum: 500, color: '#2ecc71' },
    { id: '2', name: 'Growth Fund', type: 'Stocks', risk: 'Medium', return: 7.2, minimum: 1000, color: '#3498db' },
    { id: '3', name: 'Tech Index', type: 'ETF', risk: 'High', return: 12.8, minimum: 500, color: '#9b59b6' },
    { id: '4', name: 'Global Markets', type: 'International', risk: 'High', return: 10.5, minimum: 2000, color: '#e74c3c' },
  ];

  const periods = [
    { months: 6, label: '6 months' },
    { months: 12, label: '1 year' },
    { months: 36, label: '3 years' },
    { months: 60, label: '5 years' },
  ];

  const selectedInvestment = investmentOptions.find(opt => opt.id === selectedOption);

  const calculateProjectedReturn = () => {
    const principal = parseFloat(amount) || 0;
    const annualReturn = (selectedInvestment?.return || 0) / 100;
    const years = parseInt(investmentPeriod) / 12;
    
    // Simple interest for projection
    return principal * (1 + annualReturn * years);
  };

  const handleInvest = () => {
    if (!amount || parseFloat(amount) < (selectedInvestment?.minimum || 0)) {
      alert(`Minimum investment is $${selectedInvestment?.minimum}`);
      return;
    }
    alert(`Successfully invested $${amount} in ${selectedInvestment?.name}`);
    setAmount('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderInvestmentOption = ({ item }: { item: InvestmentOption }) => (
    <TouchableOpacity
      style={[
        styles.optionCard,
        selectedOption === item.id && { borderColor: item.color, backgroundColor: `${item.color}15` },
      ]}
      onPress={() => setSelectedOption(item.id)}
    >
      <View style={styles.optionHeader}>
        <View style={[styles.optionIcon, { backgroundColor: item.color }]}>
          <FontAwesome name="chart-line" size={20} color="white" />
        </View>
        <View style={styles.optionInfo}>
          <Text style={styles.optionName}>{item.name}</Text>
          <Text style={styles.optionType}>{item.type}</Text>
        </View>
        {selectedOption === item.id && (
          <FontAwesome name="check-circle" size={20} color={item.color} />
        )}
      </View>
      
      <View style={styles.optionDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Risk</Text>
          <View style={[styles.riskBadge, { 
            backgroundColor: item.risk === 'Low' ? '#2ecc71' : item.risk === 'Medium' ? '#f39c12' : '#e74c3c'
          }]}>
            <Text style={styles.riskText}>{item.risk}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Annual Return</Text>
          <Text style={[styles.returnText, { color: item.color }]}>{item.return}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Minimum</Text>
          <Text style={styles.minimumText}>{formatCurrency(item.minimum)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Invest</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Investment Options</Text>
        <FlatList
          data={investmentOptions}
          renderItem={renderInvestmentOption}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Investment Details</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Investment Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="1000"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
          </View>
          <Text style={styles.minimumNote}>
            Minimum: {selectedInvestment ? formatCurrency(selectedInvestment.minimum) : '$500'}
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Investment Period</Text>
          <View style={styles.periodsGrid}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.months}
                style={[
                  styles.periodButton,
                  investmentPeriod === period.months.toString() && styles.periodButtonSelected,
                ]}
                onPress={() => setInvestmentPeriod(period.months.toString())}
              >
                <Text style={[
                  styles.periodText,
                  investmentPeriod === period.months.toString() && styles.periodTextSelected,
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.projectionCard}>
        <Text style={styles.projectionTitle}>Projected Returns</Text>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>Investment:</Text>
          <Text style={styles.projectionValue}>{formatCurrency(parseFloat(amount) || 0)}</Text>
        </View>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>Period:</Text>
          <Text style={styles.projectionValue}>{investmentPeriod} months</Text>
        </View>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>Expected Return:</Text>
          <Text style={styles.projectionValue}>{selectedInvestment?.return}% annually</Text>
        </View>
        <View style={[styles.projectionRow, styles.projectionTotal]}>
          <Text style={styles.projectionLabel}>Projected Value:</Text>
          <Text style={[styles.projectionValue, styles.projectionTotalValue]}>
            {formatCurrency(calculateProjectedReturn())}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.investButton} onPress={handleInvest}>
        <FontAwesome name="hand-holding-usd" size={20} color="white" />
        <Text style={styles.investButtonText}> Invest Now</Text>
      </TouchableOpacity>

      <View style={styles.disclaimer}>
        <FontAwesome name="exclamation-triangle" size={16} color="#f39c12" />
        <Text style={styles.disclaimerText}>
          Investments are subject to market risks. Past performance is not indicative of future results.
          Please read all scheme related documents carefully before investing.
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
  optionCard: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionType: {
    fontSize: 14,
    color: '#666',
  },
  optionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  riskText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  returnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  minimumText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 12,
  },
  minimumNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  periodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  periodButton: {
    width: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  periodButtonSelected: {
    borderColor: '#1A5FB4',
    backgroundColor: 'rgba(26, 95, 180, 0.05)',
  },
  periodText: {
    fontSize: 14,
    color: '#333',
  },
  periodTextSelected: {
    color: '#1A5FB4',
    fontWeight: '600',
  },
  projectionCard: {
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
  projectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  projectionTotal: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  projectionLabel: {
    fontSize: 14,
    color: '#666',
  },
  projectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  projectionTotalValue: {
    fontSize: 18,
    color: '#1A5FB4',
  },
  investButton: {
    backgroundColor: '#1A5FB4',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  investButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#f39c12',
    lineHeight: 16,
    marginLeft: 12,
  },
});

export default InvestScreen;