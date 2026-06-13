import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScoreGauge } from '@/components/scoring/ScoreGauge';
import {
  KULEX_USER_SCORE,
  SCORE_BANDS,
  SCORE_HISTORY,
  SCORE_SCALE_COLORS,
  SCORING_FACTORS,
  SCORING_IMPROVEMENT_TIPS,
} from '@/constants/scoring';
import {
  buildScoringBenefits,
  formatScoreDelta,
  getScoreBand,
  getScoreColor,
  getScoreDelta,
} from '@/lib/scoring';

const NAVY = '#1A1A4E';
const GAUGE_WIDTH = 280;
const SHEET_OVERLAP = 24;

export default function ScoringScreen() {
  const insets = useSafeAreaInsets();
  const band = getScoreBand(KULEX_USER_SCORE);
  const delta = getScoreDelta();
  const benefits = buildScoringBenefits(KULEX_USER_SCORE);
  const maxHistoryScore = Math.max(...SCORE_HISTORY.map((item) => item.score));
  const scrollY = useSharedValue(0);

  const collapsedHeight = insets.top + 64;
  const expandedHeight = insets.top + 400;
  const collapseRange = expandedHeight - collapsedHeight;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, collapseRange],
      [expandedHeight, collapsedHeight],
      Extrapolation.CLAMP,
    ),
  }));

  const heroContentStyle = useAnimatedStyle(() => {
    const progress = interpolate(scrollY.value, [0, collapseRange], [0, 1], Extrapolation.CLAMP);

    return {
      opacity: interpolate(progress, [0, 0.75], [1, 0], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(progress, [0, 1], [0, -28], Extrapolation.CLAMP) },
        { scale: interpolate(progress, [0, 1], [1, 0.82], Extrapolation.CLAMP) },
      ],
    };
  });

  const sheetLiftStyle = useAnimatedStyle(() => ({
    marginTop: interpolate(
      scrollY.value,
      [0, collapseRange],
      [-SHEET_OVERLAP, -SHEET_OVERLAP - 8],
      Extrapolation.CLAMP,
    ),
  }));

  const headerPaddingTop = useMemo(() => insets.top + 12, [insets.top]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <LinearGradient
          colors={['#2A2A6E', NAVY, '#12123A']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.headerGradient, { paddingTop: headerPaddingTop }]}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.headerBtn}
              accessibilityRole="button"
              onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Scoring Kulex</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Animated.View style={[styles.heroContent, heroContentStyle]}>
            <ScoreGauge
              score={KULEX_USER_SCORE}
              bandLabel={band.label}
              bandColor={band.color}
              width={GAUGE_WIDTH}
            />

            <View style={styles.deltaRow}>
              <Ionicons
                name={delta >= 0 ? 'trending-up' : 'trending-down'}
                size={16}
                color={delta >= 0 ? '#4ADE80' : '#FCA5A5'}
              />
              <Text style={[styles.deltaText, delta >= 0 ? styles.deltaUp : styles.deltaDown]}>
                {formatScoreDelta(delta)} pontos vs. mês anterior
              </Text>
            </View>

            <Text style={styles.heroDescription}>{band.description}</Text>
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: expandedHeight,
            paddingBottom: Math.max(insets.bottom, 20) + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.sheet, sheetLiftStyle]}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Factores do scoring</Text>
            <Text style={styles.sectionSubtitle}>
              O seu score é calculado com base no comportamento financeiro na Kulex.
            </Text>

            {SCORING_FACTORS.map((factor) => {
              const ratio =
                factor.maxPoints > 0 ? Math.min(1, factor.points / factor.maxPoints) : 0;
              const barColor =
                factor.impact === 'negative'
                  ? SCORE_SCALE_COLORS.insuficiente
                  : factor.impact === 'neutral' && factor.points === 0
                    ? '#9CA3AF'
                    : band.color;

              return (
                <View key={factor.id} style={styles.factorCard}>
                  <View style={styles.factorHeader}>
                    <View style={styles.factorIcon}>
                      <Ionicons name={factor.icon} size={18} color={NAVY} />
                    </View>
                    <View style={styles.factorInfo}>
                      <Text style={styles.factorLabel}>{factor.label}</Text>
                      <Text style={styles.factorDescription}>{factor.description}</Text>
                    </View>
                    <Text style={styles.factorPoints}>
                      {factor.maxPoints > 0 ? `+${factor.points}` : '0'}
                    </Text>
                  </View>
                  {factor.maxPoints > 0 ? (
                    <View style={styles.factorBarTrack}>
                      <View
                        style={[
                          styles.factorBarFill,
                          { width: `${ratio * 100}%`, backgroundColor: barColor },
                        ]}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evolução</Text>
            <View style={styles.historyCard}>
              {SCORE_HISTORY.map((entry, index) => {
                const barHeight = Math.max(12, (entry.score / maxHistoryScore) * 80);
                const isLatest = index === SCORE_HISTORY.length - 1;
                const entryColor = getScoreColor(entry.score);

                return (
                  <View key={entry.id} style={styles.historyCol}>
                    <Text
                      style={[
                        styles.historyScore,
                        isLatest && styles.historyScoreActive,
                        isLatest && { color: entryColor },
                      ]}>
                      {entry.score}
                    </Text>
                    <View style={styles.historyBarTrack}>
                      <View
                        style={[
                          styles.historyBarFill,
                          {
                            height: barHeight,
                            backgroundColor: entryColor,
                            opacity: isLatest ? 1 : 0.55,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.historyMonth}>{entry.monthLabel}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Produtos desbloqueados</Text>
            {benefits.map((benefit) => (
              <View
                key={benefit.id}
                style={[styles.benefitRow, !benefit.unlocked && styles.benefitRowLocked]}>
                <View
                  style={[
                    styles.benefitIcon,
                    benefit.unlocked ? styles.benefitIconUnlocked : styles.benefitIconLocked,
                  ]}>
                  <Ionicons
                    name={benefit.icon}
                    size={20}
                    color={benefit.unlocked ? NAVY : '#9CA3AF'}
                  />
                </View>
                <View style={styles.benefitInfo}>
                  <Text
                    style={[styles.benefitLabel, !benefit.unlocked && styles.benefitLabelLocked]}>
                    {benefit.label}
                  </Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                  {!benefit.unlocked ? (
                    <Text style={[styles.benefitMin, { color: getScoreColor(benefit.minScore) }]}>
                      Mínimo: {benefit.minScore} pontos
                    </Text>
                  ) : null}
                </View>
                <Ionicons
                  name={benefit.unlocked ? 'checkmark-circle' : 'lock-closed'}
                  size={22}
                  color={benefit.unlocked ? band.color : '#D1D5DB'}
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Como melhorar</Text>
            <View style={styles.tipsCard}>
              {SCORING_IMPROVEMENT_TIPS.map((tip, index) => (
                <View key={tip} style={[styles.tipRow, index > 0 && styles.tipRowBorder]}>
                  <Ionicons name="bulb-outline" size={18} color={NAVY} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.scaleCard}>
            <Text style={styles.scaleTitle}>Escala de scoring</Text>
            {SCORE_BANDS.map((item) => (
              <View key={item.id} style={styles.scaleRow}>
                <View style={[styles.scaleDot, { backgroundColor: item.color }]} />
                <Text style={styles.scaleLabel}>{item.label}</Text>
                <Text style={styles.scaleRange}>
                  {item.min} – {item.max}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 28,
    alignItems: 'center',
    marginBottom: 18,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    zIndex: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  heroContent: {
    width: '100%',
    alignItems: 'center',
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  deltaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deltaUp: {
    color: '#4ADE80',
  },
  deltaDown: {
    color: '#FCA5A5',
  },
  heroDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: '#F5F6FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 28,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: NAVY,
    marginTop: 20,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
    marginTop: -4,
  },
  factorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  factorIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF0F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  factorInfo: {
    flex: 1,
    gap: 2,
  },
  factorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
  },
  factorDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#6B7280',
  },
  factorPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
  factorBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEF0F8',
    overflow: 'hidden',
  },
  factorBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    minHeight: 140,
  },
  historyCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  historyScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  historyScoreActive: {
    color: NAVY,
    fontWeight: '800',
  },
  historyBarTrack: {
    height: 80,
    justifyContent: 'flex-end',
  },
  historyBarFill: {
    width: 28,
    borderRadius: 6,
  },
  historyMonth: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
  },
  benefitRowLocked: {
    opacity: 0.75,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitIconUnlocked: {
    backgroundColor: '#EEF0F8',
  },
  benefitIconLocked: {
    backgroundColor: '#F3F4F6',
  },
  benefitInfo: {
    flex: 1,
    gap: 2,
  },
  benefitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
  },
  benefitLabelLocked: {
    color: '#6B7280',
  },
  benefitDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  benefitMin: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
  },
  tipRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#4B5563',
  },
  scaleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  scaleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 4,
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scaleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scaleLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: NAVY,
  },
  scaleRange: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
