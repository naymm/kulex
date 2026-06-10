import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CardFlowPrimaryButton, CardFlowShell } from '@/components/cards/CardFlowShell';
import { PostpaidCardPreview } from '@/components/cards/PostpaidCardPreview';
import { getScoringLabel, type PostpaidCardTierId } from '@/constants/postpaid-card';

export default function PostpaidCardSuccessScreen() {
  const { plafondLabel, plafondAmount, cardTierId, dueDayLabel } = useLocalSearchParams<{
    plafondLabel?: string;
    plafondAmount?: string;
    cardTierId?: string;
    dueDayLabel?: string;
  }>();

  const tierId = (cardTierId as PostpaidCardTierId) ?? 'branco';

  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 14, stiffness: 140 });
    circleOpacity.value = withTiming(1, { duration: 280 });
    checkScale.value = withDelay(220, withSpring(1, { damping: 11, stiffness: 180 }));
    checkOpacity.value = withDelay(220, withTiming(1, { duration: 200 }));
    contentOpacity.value = withDelay(420, withTiming(1, { duration: 350 }));
  }, [checkOpacity, checkScale, circleOpacity, circleScale, contentOpacity]);

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
  }));

  return (
    <CardFlowShell
      footer={
        <CardFlowPrimaryButton
          label="Entendi"
          onPress={() => router.replace('/(tabs)/cards')}
        />
      }>
      <View style={styles.center}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={42} color="#16A34A" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.title}>Cartão solicitado com sucesso</Text>
          <Text style={styles.subtitle}>
            O seu {getScoringLabel(tierId)} será emitido em breve. Receberá uma notificação quando
            estiver disponível.
          </Text>

          <PostpaidCardPreview cardTierId={tierId} width={260} />

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>{getScoringLabel(tierId)} · {plafondLabel ?? '—'}</Text>
            <Text style={styles.summaryValue}>Plafond AOA {plafondAmount ?? '—'}</Text>
            {dueDayLabel ? (
              <Text style={styles.summaryDue}>Vencimento: {dueDayLabel} (dia útil)</Text>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </CardFlowShell>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  summaryCard: {
    marginTop: 20,
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A4E',
  },
  summaryDue: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
});
