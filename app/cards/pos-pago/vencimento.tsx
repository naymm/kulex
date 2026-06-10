import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardFlowPrimaryButton, CardFlowShell } from '@/components/cards/CardFlowShell';
import {
  POSTPAID_BILLING_DUE_DAYS,
  type PostpaidDueDayOption,
} from '@/constants/postpaid-card';
import {
  parsePostpaidBaseParams,
  postpaidParamsToRoute,
} from '@/lib/postpaid-card';

export default function PostpaidCardDueDayScreen() {
  const insets = useSafeAreaInsets();
  const baseParams = parsePostpaidBaseParams(useLocalSearchParams());
  const defaultDueDay = POSTPAID_BILLING_DUE_DAYS[0];

  const [selectedDueDay, setSelectedDueDay] = useState<PostpaidDueDayOption>(defaultDueDay);

  const selectedDescription = useMemo(
    () => `A fatura será cobrada no ${selectedDueDay.description.toLowerCase()}.`,
    [selectedDueDay.description],
  );

  const continueToConfirm = () => {
    if (!baseParams) return;

    router.push({
      pathname: '/cards/pos-pago/confirmacao',
      params: postpaidParamsToRoute({
        ...baseParams,
        dueDayId: selectedDueDay.id,
        dueDay: String(selectedDueDay.day),
        dueDayLabel: selectedDueDay.label,
      }),
    });
  };

  if (!baseParams) {
    return (
      <CardFlowShell title="Dia de vencimento">
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Não foi possível carregar os dados do pedido.</Text>
        </View>
      </CardFlowShell>
    );
  }

  return (
    <CardFlowShell
      title="Dia de vencimento"
      footer={<CardFlowPrimaryButton label="Continuar" onPress={continueToConfirm} />}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 120 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>
          Escolha o dia útil de vencimento para cobrança da fatura do seu cartão pós-pago.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Como funciona</Text>
          <Text style={styles.infoText}>
            A fatura fecha no último dia do mês. O pagamento vence no dia útil que seleccionar abaixo.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Dias disponíveis</Text>
        <View style={styles.list}>
          {POSTPAID_BILLING_DUE_DAYS.map((option) => {
            const isSelected = selectedDueDay.id === option.id;
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isSelected && styles.optionSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedDueDay(option)}>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.footerNote}>{selectedDescription}</Text>
      </ScrollView>
    </CardFlowShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  infoText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  list: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: '#C9A227',
    backgroundColor: '#FFFBEB',
  },
  optionText: {
    flex: 1,
    paddingRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  optionDescription: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#C9A227',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C9A227',
  },
  footerNote: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    lineHeight: 17,
    textAlign: 'center',
  },
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
