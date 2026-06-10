import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import {
  formatCardNumber,
  formatExpiry,
  parseCardDigits,
  parseCvc,
  parseExpiryDigits,
} from '@/lib/card';

function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

function CardBrands() {
  return (
    <View style={styles.brands}>
      <Text style={styles.visa}>VISA</Text>
      <View style={styles.mastercard}>
        <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
        <View style={[styles.mcCircle, styles.mcOverlap, { backgroundColor: '#F79E1B' }]} />
      </View>
    </View>
  );
}

export default function AddMoneyCardScreen() {
  const { amount } = useLocalSearchParams<{ amount?: string }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [holder, setHolder] = useState('');

  return (
    <AddMoneyShell
      title="Adicionar Cartão"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() =>
            router.push({
              pathname: '/add-money/confirm',
              params: { amount: amountDigits, method: 'cartao' },
            })
          }
        />
      }>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.verifiedRow}>
          <Text style={styles.verifiedBy}>Verified by</Text>
          <Text style={styles.verifiedVisa}>VISA</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <FieldLabel>Número do cartão</FieldLabel>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputFlex}
                value={formatCardNumber(cardNumber)}
                onChangeText={(text) => setCardNumber(parseCardDigits(text))}
                placeholder="1234 1234 1234 1234"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="number-pad"
              />
              <CardBrands />
            </View>
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.field, styles.halfField]}>
              <FieldLabel>Data</FieldLabel>
              <TextInput
                style={styles.input}
                value={formatExpiry(expiry)}
                onChangeText={(text) => setExpiry(parseExpiryDigits(text))}
                placeholder="MM/AA"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="number-pad"
              />
            </View>
            <View style={[styles.field, styles.halfField]}>
              <FieldLabel>CVC</FieldLabel>
              <TextInput
                style={styles.input}
                value={cvc}
                onChangeText={(text) => setCvc(parseCvc(text))}
                placeholder="123"
                placeholderTextColor="rgba(255,255,255,0.35)"
                keyboardType="number-pad"
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.field}>
            <FieldLabel>Titular do cartão</FieldLabel>
            <TextInput
              style={styles.input}
              value={holder}
              onChangeText={setHolder}
              placeholder="Primeiro e último nome"
              placeholderTextColor="rgba(255,255,255,0.35)"
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.securityBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />
          <View style={styles.securityText}>
            <Text style={styles.securityTitle}>Segurança dos dados</Text>
            <Text style={styles.securityBody}>
              A sua segurança está em primeiro lugar, não guardamos os dados do seu cartão. As
              informações são usadas apenas para concluir esta operação
            </Text>
          </View>
        </View>
      </ScrollView>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginTop: 20,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  verifiedBy: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  verifiedVisa: {
    fontSize: 16,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 10,
  },
  halfField: {
    flex: 1,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
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
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  inputRow: {
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFlex: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    padding: 0,
  },
  brands: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
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
  securityBox: {
    marginTop: 28,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  securityText: {
    flex: 1,
    gap: 6,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  securityBody: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
});
