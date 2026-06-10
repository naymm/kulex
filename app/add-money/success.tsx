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
  REFERENCE_ENTITY,
  REFERENCE_NUMBER,
  REFERENCE_VALIDITY,
} from '@/constants/add-money';
import { computeAddMoneySummary } from '@/lib/add-money';

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function AddMoneySuccessScreen() {
  const { amount, method } = useLocalSearchParams<{ amount?: string; method?: string }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const methodId = typeof method === 'string' ? method : 'multicaixa';
  const isCard = methodId === 'cartao';
  const summary = useMemo(() => computeAddMoneySummary(amountDigits), [amountDigits]);

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
      <View style={styles.center}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          {isCard ? (
            <Text style={styles.cardTitle}>
              Carregamento efectuado{'\n'}com sucesso
            </Text>
          ) : (
            <>
              <Text style={styles.title}>Confirmado</Text>
              <Text style={styles.subtitle}>Referência gerada com sucesso</Text>

              <View style={styles.details}>
                <DetailBlock label="Montante" value={summary.amountFormattedWithKz} />
                <DetailBlock label="Entidade" value={REFERENCE_ENTITY} />
                <DetailBlock label="Referência" value={REFERENCE_NUMBER} />
                <DetailBlock label="Validade por" value={REFERENCE_VALIDITY} />
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
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
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
