import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  SendMoneyPrimaryButton,
  SendMoneyShell,
} from '@/components/send-money/SendMoneyShell';
import { getContactById } from '@/constants/contacts';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function SendMoneyConfirmScreen() {
  const { contact: contactId, amount } = useLocalSearchParams<{
    contact?: string;
    amount?: string;
  }>();
  const contact = useMemo(
    () => getContactById(typeof contactId === 'string' ? contactId : '') ?? getContactById('ruben-troso')!,
    [contactId]
  );
  const amountDigits = typeof amount === 'string' ? amount : '';
  const amountFormatted = formatMoneyFromDigitsAsCents(amountDigits);

  return (
    <SendMoneyShell
      footer={
        <SendMoneyPrimaryButton
          label="Confirmar"
          onPress={() =>
            router.push({
              pathname: '/send-money/[contact]/pin',
              params: { contact: contact.id, amount: amountDigits },
            })
          }
        />
      }>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Confirmação da Transferência</Text>
        <View style={styles.divider} />
        <ConfirmRow label="Para" value={contact.name} />
        <ConfirmRow label="Telemóvel" value={contact.phone} />
        <ConfirmRow label="Valor" value={amountFormatted} />
        <ConfirmRow label="Taxa" value="0,00" />
        <ConfirmRow label="Chegada" value="Imediato" />
      </View>
    </SendMoneyShell>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 16,
  },
});
