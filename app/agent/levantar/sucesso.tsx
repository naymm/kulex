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
import { formatWithdrawReference } from '@/lib/agent-withdraw';
import { registerAgentOperation } from '@/lib/agent';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';
import { computeWithdrawSummary } from '@/lib/withdraw';

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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

export default function AgentLevantarSucessoScreen() {
  const { reference, amount } = useLocalSearchParams<{
    reference?: string;
    amount?: string;
  }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const referenceDigits = typeof reference === 'string' ? reference : '';
  const referenceFormatted = formatWithdrawReference(referenceDigits);
  const summary = useMemo(() => computeWithdrawSummary(amountDigits), [amountDigits]);
  const amountFormatted = summary.amountFormatted;
  const clientTotalFormatted = summary.reflectedFormatted;
  const transactionDate = useMemo(() => formatTransactionDate(new Date()), []);
  const transactionRef = useMemo(
    () => `COUT${Date.now().toString().slice(-8)}`,
    [],
  );

  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(16);

  useEffect(() => {
    registerAgentOperation({
      type: 'cash-out',
      title: 'Cash-out',
      clientName: referenceFormatted,
      amount: `AOA ${amountFormatted}`,
      commission: '+500,00 kz',
    });
  }, [amountFormatted, referenceFormatted]);

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
        <AddMoneyPrimaryButton label="Entendi" onPress={() => router.replace('/(tabs)')} />
      }>
      <View style={styles.center}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.title}>Cash-out efectuado{'\n'}com sucesso</Text>

          <View style={styles.card}>
            <DetailRow label="Montante" value={`AOA ${amountFormatted}`} />
            <DetailRow label="Taxa" value={`AOA ${summary.feeFormatted}`} />
            <DetailRow label="Total entregue ao cliente" value={`AOA ${clientTotalFormatted}`} />
            <DetailRow label="Referência" value={referenceFormatted} />
            <DetailRow label="Comissão" value="AOA 500,00" />
            <DetailRow label="Refª da Transação" value={transactionRef} />
            <DetailRow label="Data" value={transactionDate} last />
          </View>
        </Animated.View>
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 28,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
  rowValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'right',
  },
});
