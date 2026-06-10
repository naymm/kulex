import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { BankSelectSheet } from '@/components/withdraw/BankSelectSheet';
import { DEFAULT_BANK, type Bank } from '@/constants/banks';
import { formatIbanBody, IBAN_PREFIX, parseIbanDigits } from '@/lib/iban';

function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

export default function WithdrawBankAccountScreen() {
  const { amount } = useLocalSearchParams<{ amount?: string }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const [bank, setBank] = useState<Bank>(DEFAULT_BANK);
  const [ibanDigits, setIbanDigits] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [bankPickerOpen, setBankPickerOpen] = useState(false);

  return (
    <>
      <AddMoneyShell
        title="Conta Bancária"
        footer={
          <AddMoneyPrimaryButton
            label="Continuar"
            onPress={() => {
              router.push({
                pathname: '/withdraw/confirm',
                params: {
                  amount: amountDigits,
                  method: 'banco',
                  bank: bank.name,
                  iban: ibanDigits,
                  titular: beneficiary,
                },
              });
            }}
          />
        }>
        <View style={styles.form}>
          <View style={styles.field}>
            <FieldLabel>Banco</FieldLabel>
            <Pressable
              style={styles.input}
              accessibilityRole="button"
              onPress={() => setBankPickerOpen(true)}>
              <Text style={styles.inputText}>{bank.selectLabel}</Text>
              <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.field}>
            <FieldLabel>IBAN</FieldLabel>
            <View style={styles.ibanInput}>
              <Text style={styles.ibanPrefix}>{IBAN_PREFIX} </Text>
              <TextInput
                style={styles.ibanField}
                value={formatIbanBody(ibanDigits)}
                onChangeText={(text) => setIbanDigits(parseIbanDigits(text))}
                keyboardType="number-pad"
                placeholderTextColor="rgba(255,255,255,0.35)"
              />
            </View>
          </View>

          <View style={styles.field}>
            <FieldLabel>Nome do Beneficiário</FieldLabel>
            <TextInput
              style={styles.inputTextOnly}
              value={beneficiary}
              onChangeText={setBeneficiary}
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
          </View>
        </View>
      </AddMoneyShell>

      <BankSelectSheet
        visible={bankPickerOpen}
        onClose={() => setBankPickerOpen(false)}
        selected={bank}
        onSelect={setBank}
      />
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 36,
    gap: 24,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
  },
  input: {
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  inputTextOnly: {
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  ibanInput: {
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ibanPrefix: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  ibanField: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    padding: 0,
  },
});
