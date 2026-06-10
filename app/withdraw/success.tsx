import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import {
  AGENT_PIN,
  AGENT_REFERENCE,
  AGENT_VALIDITY,
  BANK_SUCCESS_NOTE,
  BANK_TRANSACTION_REF,
} from '@/constants/withdraw';
import { computeWithdrawSummary } from '@/lib/withdraw';

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function BankDetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.bankRow, last && styles.bankRowLast]}>
      <Text style={styles.bankRowLabel}>{label}</Text>
      <Text style={styles.bankRowValue}>{value}</Text>
    </View>
  );
}

function formatTransactionDate(date: Date) {
  const datePart = date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return `${datePart}, ${timePart}`;
}

export default function WithdrawSuccessScreen() {
  const { amount, method, from } = useLocalSearchParams<{
    amount?: string;
    method?: string;
    from?: string;
  }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const methodId = typeof method === 'string' ? method : 'agente';
  const isBank = methodId === 'banco';
  const isTransfer = from === 'transfer';
  const summary = useMemo(() => computeWithdrawSummary(amountDigits), [amountDigits]);
  const transactionDate = useMemo(() => formatTransactionDate(new Date()), []);

  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(16);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 14, stiffness: 140 });
    circleOpacity.value = withTiming(1, { duration: 280 });
    checkScale.value = withDelay(220, withSpring(1, { damping: 11, stiffness: 180 }));
    checkOpacity.value = withDelay(220, withTiming(1, { duration: 200 }));
    contentOpacity.value = withDelay(420, withTiming(1, { duration: 350 }));
    contentTranslateY.value = withDelay(420, withSpring(0, { damping: 16, stiffness: 120 }));
  }, [checkOpacity, checkScale, circleOpacity, circleScale, contentOpacity, contentTranslateY]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <AddMoneyShell
      hideHeader
      footer={
        <AddMoneyPrimaryButton
          label="Entendi"
          onPress={() => router.replace('/(tabs)')}
        />
      }>
      <View style={[styles.center, isBank && styles.centerBank]}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          {isBank ? (
            <>
              <Text style={styles.bankTitle}>
                {isTransfer
                  ? 'Transferência efectuada\ncom sucesso'
                  : 'Levantamento efectuado\ncom sucesso'}
              </Text>

              <View style={styles.bankCard}>
                <BankDetailRow label="Refª da Transação" value={BANK_TRANSACTION_REF} />
                <BankDetailRow label="Data" value={transactionDate} last />
                <View style={styles.noteSection}>
                  <Text style={styles.noteLabel}>Nota</Text>
                  <Text style={styles.noteText}>{BANK_SUCCESS_NOTE}</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Confirmado</Text>
              <Text style={styles.subtitle}>Referência gerada com sucesso</Text>

              <View style={styles.details}>
                <DetailBlock label="Montante" value={summary.amountFormattedWithKz} />
                <DetailBlock label="Referência" value={AGENT_REFERENCE} />
                <DetailBlock label="PIN" value={AGENT_PIN} />
                <DetailBlock label="Validade por" value={AGENT_VALIDITY} />
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  centerBank: {
    justifyContent: 'flex-start',
    paddingTop: 32,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bankTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 28,
  },
  bankCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  bankRowLast: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bankRowLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
  bankRowValue: {
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  noteSection: {
    paddingTop: 16,
    gap: 8,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
  },
  noteText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  details: {
    marginTop: 36,
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  detailBlock: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
  detailValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
