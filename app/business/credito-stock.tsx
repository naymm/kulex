import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AddMoneyPrimaryButton, AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import { BUSINESS_STOCK_CREDIT } from '@/constants/business';
import { formatMoneyFromDigitsAsCents, normalizeDigits } from '@/lib/money';

export default function BusinessCreditoStockScreen() {
  const [amountDigits, setAmountDigits] = useState('');
  const amountFormatted = formatMoneyFromDigitsAsCents(amountDigits);

  return (
    <AddMoneyShell
      title="Crédito de stock"
      footer={
        <AddMoneyPrimaryButton
          label="Solicitar"
          disabled={!amountDigits || amountDigits === '0'}
          onPress={() => router.back()}
        />
      }>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Disponível</Text>
        <Text style={styles.infoValue}>{BUSINESS_STOCK_CREDIT.available}</Text>
        <Text style={styles.infoMeta}>
          TAN {BUSINESS_STOCK_CREDIT.tan} · Prazo {BUSINESS_STOCK_CREDIT.termDays} dias
        </Text>
      </View>

      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Montante a utilizar</Text>
        <Text style={[styles.amount, !amountDigits && styles.amountEmpty]}>
          AOA {amountFormatted}
        </Text>
      </View>

      <NumericKeypad
        onDigit={(d) => setAmountDigits((p) => normalizeDigits(p + d))}
        onDelete={() => setAmountDigits((p) => p.slice(0, -1))}
        variant="dark"
      />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  infoLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  infoValue: { marginTop: 6, fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  infoMeta: { marginTop: 8, fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.55)' },
  amountSection: { alignItems: 'center', marginTop: 28, marginBottom: 12 },
  amountLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.55)', marginBottom: 8 },
  amount: { fontSize: 42, fontWeight: '700', color: '#FFFFFF' },
  amountEmpty: { color: 'rgba(255,255,255,0.35)' },
});
