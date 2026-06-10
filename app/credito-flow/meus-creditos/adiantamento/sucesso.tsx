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
import { getAccountById } from '@/constants/accounts';
import { ADIANTAMENTO_CREDIT_ID } from '@/constants/credit-line';
import type { AdvanceSettlementMode } from '@/lib/credit-advances';

export default function LiquidarAdiantamentoSucessoScreen() {
  const { mode, accountId, amount, title, settledCount } = useLocalSearchParams<{
    mode?: string;
    accountId?: string;
    amount?: string;
    title?: string;
    settledCount?: string;
  }>();

  const settlementMode: AdvanceSettlementMode = mode === 'all' ? 'all' : 'single';
  const account = useMemo(
    () => getAccountById(typeof accountId === 'string' ? accountId : ''),
    [accountId],
  );
  const count = Number(settledCount ?? '1');

  const subtitle = useMemo(() => {
    const amountLabel = typeof amount === 'string' ? amount : '0,00';
    const base =
      settlementMode === 'all'
        ? `Liquidou ${count} adiantamento${count === 1 ? '' : 's'} no total de AOA ${amountLabel}.`
        : `Liquidou o adiantamento «${title ?? 'Adiantamento'}» no valor de AOA ${amountLabel}.`;

    return `${base} Débito efectuado na conta ${account.shortLabel}.`;
  }, [account.shortLabel, amount, count, settlementMode, title]);

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
          label="Voltar a Meus Créditos"
          onPress={() =>
            router.replace({
              pathname: '/credito-flow/meus-creditos/[credit]',
              params: { credit: ADIANTAMENTO_CREDIT_ID },
            })
          }
        />
      }>
      <View style={styles.center}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.title}>Adiantamento liquidado</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 22,
  },
});
