import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { WITHDRAW_METHODS, type WithdrawMethodId } from '@/constants/withdraw';

function MethodRow({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: 'person-outline' | 'business-outline' | 'flower-outline';
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} accessibilityRole="button" onPress={onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]} />
    </Pressable>
  );
}

export default function WithdrawMethodScreen() {
  const { amount } = useLocalSearchParams<{ amount?: string }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const [method, setMethod] = useState<WithdrawMethodId>('agente');

  return (
    <AddMoneyShell
      title="Método"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() => {
            if (method === 'banco') {
              router.push({
                pathname: '/withdraw/bank-account',
                params: { amount: amountDigits },
              });
              return;
            }
            router.push({
              pathname: '/withdraw/confirm',
              params: { amount: amountDigits, method },
            });
          }}
        />
      }>
      <View style={styles.list}>
        {WITHDRAW_METHODS.map((item) => (
          <MethodRow
            key={item.id}
            label={item.label}
            icon={item.icon}
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
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  radioSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
});
