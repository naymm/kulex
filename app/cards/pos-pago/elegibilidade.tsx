import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CardFlowPrimaryButton, CardFlowShell, NAVY } from '@/components/cards/CardFlowShell';
import { ScoreGauge } from '@/components/scoring/ScoreGauge';
import {
  getEligibleCardProducts,
  getMaxCardTierForScore,
  getScoringLabel,
  POSTPAID_CARD_MIN_SCORE,
  POSTPAID_CARD_SCORE,
} from '@/constants/postpaid-card';
import { getScoreBand } from '@/lib/scoring';

const RESULT_TRANSITION_MS = 520;

export default function PostpaidCardEligibilityScreen() {
  const [phase, setPhase] = useState<'checking' | 'result'>('checking');
  const reveal = useSharedValue(0);
  const maxTier = getMaxCardTierForScore(POSTPAID_CARD_SCORE);
  const eligibleCards = getEligibleCardProducts(POSTPAID_CARD_SCORE);
  const isEligible = maxTier !== null;

  const displayScore = isEligible ? POSTPAID_CARD_SCORE : POSTPAID_CARD_MIN_SCORE - 42;
  const band = useMemo(() => getScoreBand(displayScore), [displayScore]);
  const gaugeBandLabel = useMemo(
    () =>
      isEligible && maxTier
        ? `Até ${getScoringLabel(maxTier)}`
        : `Mín. ${POSTPAID_CARD_MIN_SCORE}`,
    [isEligible, maxTier],
  );

  useEffect(() => {
    const timer = setTimeout(() => setPhase('result'), 2050);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'result') return;
    reveal.value = withTiming(1, {
      duration: RESULT_TRANSITION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [phase, reveal]);

  const checkingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.value, [0, 0.4], [1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(reveal.value, [0, 1], [0, -10], Extrapolation.CLAMP) },
    ],
  }));

  const resultStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.value, [0.12, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(reveal.value, [0, 1], [18, 0], Extrapolation.CLAMP) },
    ],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.value, [0.2, 0.85], [0, 1], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(reveal.value, [0.2, 1], [0.72, 1], Extrapolation.CLAMP) },
    ],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.value, [0.45, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(reveal.value, [0.45, 1], [20, 0], Extrapolation.CLAMP) },
    ],
  }));

  const continueToPlafond = () => {
    if (!maxTier) return;
    router.push({
      pathname: '/cards/pos-pago/plafond',
      params: { score: String(POSTPAID_CARD_SCORE) },
    });
  };

  const resultContent = isEligible ? (
    <>
      
      <Text style={styles.title}>Elegível para cartão pós-pago</Text>
      <Text style={styles.subtitle}>
        Com base no seu scoring, pode escolher entre{' '}
        {eligibleCards.map((card) => card.label).join(', ')}, com plafond dentro do intervalo de cada
        um.
      </Text>
      <Pressable
        style={styles.scoringLink}
        accessibilityRole="button"
        onPress={() => router.push('/scoring')}>
        <Text style={styles.scoringLinkText}>Ver scoring completo</Text>
        <Ionicons name="chevron-forward" size={16} color={NAVY} />
      </Pressable>
    </>
  ) : (
    <>
      <Animated.View style={[styles.statusIcon, iconStyle]}>
        <Ionicons name="close-circle" size={56} color="#DC2626" />
      </Animated.View>
      <Text style={styles.title}>Ainda não elegível</Text>
      <Text style={styles.subtitle}>
        Continue a utilizar a Kulex para melhorar o seu scoring e volte a solicitar mais tarde.
      </Text>
      <Pressable
        style={styles.scoringLink}
        accessibilityRole="button"
        onPress={() => router.push('/scoring')}>
        <Text style={styles.scoringLinkText}>Ver scoring completo</Text>
        <Ionicons name="chevron-forward" size={16} color={NAVY} />
      </Pressable>
    </>
  );

  return (
    <CardFlowShell
      title="Elegibilidade"
      footer={
        phase === 'result' ? (
          <Animated.View style={footerStyle}>
            {isEligible ? (
              <CardFlowPrimaryButton label="Escolher cartão" onPress={continueToPlafond} />
            ) : (
              <CardFlowPrimaryButton
                label="Voltar ao cartão"
                onPress={() => router.replace('/(tabs)/cards')}
              />
            )}
          </Animated.View>
        ) : undefined
      }>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.gaugeWrap}>
          <ScoreGauge
            score={displayScore}
            bandLabel={isEligible ? gaugeBandLabel : band.label}
            bandColor={band.color}
            width={260}
          />
        </View>

        <View style={styles.messageArea}>
          <Animated.View
            style={[styles.messageLayer, checkingStyle]}
            pointerEvents={phase === 'result' ? 'none' : 'auto'}>
            <Text style={styles.title}>A verificar o seu scoring...</Text>
            <Text style={styles.subtitle}>
              Analisamos o seu perfil financeiro para definir os cartões e plafonds disponíveis.
            </Text>
          </Animated.View>

          {phase === 'result' ? (
            <Animated.View
              style={[styles.messageLayer, styles.resultLayer, resultStyle]}
              pointerEvents="auto">
              {resultContent}
            </Animated.View>
          ) : null}
        </View>
      </ScrollView>
    </CardFlowShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  gaugeWrap: {
    marginBottom: 8,
  },
  messageArea: {
    width: '100%',
    minHeight: 200,
    alignItems: 'center',
  },
  messageLayer: {
    width: '100%',
    alignItems: 'center',
  },
  resultLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  statusIcon: {
    marginTop: 4,
    marginBottom: 4,
  },
  title: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  scoringLink: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoringLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
});
