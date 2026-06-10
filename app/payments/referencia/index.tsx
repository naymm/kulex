import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PaymentAmountField,
  PaymentEntityField,
  PaymentTextField,
} from '@/components/payments/PaymentFormFields';
import {
  buildReferencePaymentSummary,
  formatReferenceEntityInput,
  formatReferenceNumberInput,
  getPaymentEntityName,
  isReferenceEntityComplete,
  isReferenceNumberComplete,
  isValidReferencePaymentForm,
} from '@/lib/reference-payment';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

export default function ReferencePaymentScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [entityDigits, setEntityDigits] = useState('');
  const [referenceDigits, setReferenceDigits] = useState('');
  const [amountDigits, setAmountDigits] = useState('');

  const entityComplete = isReferenceEntityComplete(entityDigits);
  const entityName = getPaymentEntityName(entityDigits);
  const referenceComplete = isReferenceNumberComplete(referenceDigits);
  const showReferenceField = entityComplete;
  const showAmountField = entityComplete && referenceComplete;

  const canContinue = isValidReferencePaymentForm(
    entityDigits,
    referenceDigits,
    amountDigits,
  );

  const handleEntityChange = (text: string) => {
    const digits = formatReferenceEntityInput(text);
    if (digits !== entityDigits) {
      setReferenceDigits('');
      setAmountDigits('');
    }
    setEntityDigits(digits);
  };

  const handleReferenceChange = (text: string) => {
    const digits = formatReferenceNumberInput(text);
    if (digits !== referenceDigits) {
      setAmountDigits('');
    }
    setReferenceDigits(digits);
  };

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
          <Text style={styles.headerTitle}>Pagamento Por Referência</Text>
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
        <PaymentEntityField
          label="Entidade"
          entityDigits={entityDigits}
          entityName={entityName}
          placeholder="Ex.: 04041"
          onChangeEntityDigits={handleEntityChange}
        />

        {showReferenceField ? (
          <PaymentTextField
            label="Referência"
            value={referenceDigits}
            placeholder="9 dígitos"
            keyboardType="number-pad"
            onChangeText={handleReferenceChange}
          />
        ) : null}

        {showAmountField ? (
          <PaymentAmountField
            label="Montante"
            amountDigits={amountDigits}
            onChangeAmountDigits={setAmountDigits}
          />
        ) : null}

        {showAmountField ? (
          <Pressable
            style={[styles.primaryBtn, !canContinue && styles.primaryBtnDisabled]}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canContinue }}
            disabled={!canContinue}
            onPress={() => {
              if (!canContinue) return;
              const summary = buildReferencePaymentSummary(
                entityDigits,
                referenceDigits,
                amountDigits,
              );
              router.push({
                pathname: '/payments/referencia/confirm',
                params: {
                  entity: summary.entityLabel,
                  reference: summary.reference,
                  amount: summary.amount,
                },
              });
            }}>
            <Text style={styles.primaryBtnText}>Continuar</Text>
          </Pressable>
        ) : null}
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
