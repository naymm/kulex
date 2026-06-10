import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { PAYMENT_METHODS, type PaymentMethodId } from '@/constants/add-money';

function MethodRow({
  label,
  icon,
  showCardBrands,
  selected,
  onPress,
}: {
  label: string;
  icon: 'flower-outline' | 'card-outline';
  showCardBrands?: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} accessibilityRole="button" onPress={onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
        <Text style={styles.rowLabel}>{label}</Text>
        {showCardBrands ? (
          <View style={styles.brands}>
            <Text style={styles.visa}>VISA</Text>
            <View style={styles.mastercard}>
              <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.mcCircle, styles.mcOverlap, { backgroundColor: '#F79E1B' }]} />
            </View>
          </View>
        ) : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]} />
    </Pressable>
  );
}

export default function AddMoneyMethodScreen() {
  const { amount } = useLocalSearchParams<{ amount?: string }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const [method, setMethod] = useState<PaymentMethodId>('multicaixa');

  return (
    <AddMoneyShell
      title="Método"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() => {
            if (method === 'cartao') {
              router.push({
                pathname: '/add-money/card',
                params: { amount: amountDigits },
              });
              return;
            }
            router.push({
              pathname: '/add-money/confirm',
              params: { amount: amountDigits, method },
            });
          }}
        />
      }>
      <View style={styles.list}>
        {PAYMENT_METHODS.map((item) => (
          <MethodRow
            key={item.id}
            label={item.label}
            icon={item.icon}
            showCardBrands={item.showCardBrands}
            selected={method === item.id}
            onPress={() => setMethod(item.id)}
          />
        ))}
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 36,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  brands: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 4,
  },
  visa: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  mastercard: {
    flexDirection: 'row',
    width: 24,
    height: 14,
  },
  mcCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  mcOverlap: {
    marginLeft: -6,
    opacity: 0.9,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
});
