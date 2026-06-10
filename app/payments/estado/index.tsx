import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PaymentAmountField,
  PaymentTextField,
} from '@/components/payments/PaymentFormFields';
import {
  formatEstadoReferenceDisplay,
  formatEstadoReferenceInput,
  getEstadoAmountLabel,
  isValidEstadoPayment,
} from '@/lib/estado-payment';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

export default function EstadoPaymentScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [referenceDigits, setReferenceDigits] = useState('');
  const [amountDigits, setAmountDigits] = useState('');

  const referenceDisplay = formatEstadoReferenceDisplay(referenceDigits);
  const canContinue = isValidEstadoPayment(referenceDigits, amountDigits);

  const goBack = () => {
    goBackFromOrigin(from, () => {
      router.dismissTo('/(tabs)/payments');
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} onPress={goBack} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Pagamento ao Estado</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <PaymentTextField
          label="Referência"
          value={referenceDisplay}
          placeholder="Ex.: 1234 5678 9012 3456 7890"
          keyboardType="number-pad"
          onChangeText={(text) => setReferenceDigits(formatEstadoReferenceInput(text))}
        />
        <PaymentAmountField
          label="Valor"
          amountDigits={amountDigits}
          onChangeAmountDigits={setAmountDigits}
        />

        <Pressable
          style={[styles.primaryBtn, !canContinue && styles.primaryBtnDisabled]}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          disabled={!canContinue}
          onPress={() => {
            if (!canContinue) return;
            router.push({
              pathname: '/payments/estado/confirm',
              params: {
                reference: referenceDisplay,
                amount: getEstadoAmountLabel(amountDigits),
                amountDigits,
              },
            });
          }}>
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  primaryBtn: {
    marginTop: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
