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
import { DEFAULT_ACCOUNT_ID, getAccountById } from '@/constants/accounts';
import { POSTPAID_BLACK_CARD } from '@/constants/card';
import { digitsToMoneyFormatted } from '@/lib/postpaid-bill';

export default function PostpaidBillSuccessScreen() {
  const { amount, accountId } = useLocalSearchParams<{
    amount?: string;
    accountId?: string;
  }>();

  const account = useMemo(
    () => getAccountById(typeof accountId === 'string' && accountId ? accountId : DEFAULT_ACCOUNT_ID),
    [accountId],
  );

  const amountFormatted = useMemo(() => {
    const digits = typeof amount === 'string' ? amount : '';
    return digitsToMoneyFormatted(digits);
  }, [amount]);

  const paymentLabel = 'Pagamento da fatura';

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
          label="Voltar aos cartões"
          onPress={() => router.replace('/(tabs)/cards')}
        />
      }>
      <View style={styles.center}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.title}>Fatura paga com sucesso</Text>
          <Text style={styles.subtitle}>
            {paymentLabel} de AOA {amountFormatted} no {POSTPAID_BLACK_CARD.label}, debitado da
            conta {account.shortLabel}.
          </Text>
          <Text style={styles.hint}>
            O plafond disponível será actualizado em breve na sua carteira.
          </Text>
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
  hint: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
