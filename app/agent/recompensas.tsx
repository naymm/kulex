import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AGENT_REWARDS } from '@/constants/agent';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';

export default function AgentRecompensasScreen() {
  const insets = useSafeAreaInsets();
  const currentLevel = AGENT_REWARDS.levels.find((l) => l.id === AGENT_REWARDS.levelId)!;
  const progress = Math.min(AGENT_REWARDS.points / AGENT_REWARDS.nextLevelPoints, 1);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backBtn}
            accessibilityRole="button"
            onPress={() => goBackFromOrigin(undefined, () => router.back())}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>KULEX Recompensas</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#2A2A6E', '#1A1A4E']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Ionicons name="trophy" size={40} color={GOLD} />
          <Text style={styles.points}>{AGENT_REWARDS.points.toLocaleString('pt-PT')}</Text>
          <Text style={styles.pointsLabel}>pontos acumulados</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Nível {currentLevel.name}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressHint}>
            Faltam {(AGENT_REWARDS.nextLevelPoints - AGENT_REWARDS.points).toLocaleString('pt-PT')}{' '}
            pontos para Platina
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Níveis</Text>
        <View style={styles.levelsCard}>
          {AGENT_REWARDS.levels.map((level, index) => {
            const active = level.id === AGENT_REWARDS.levelId;
            return (
              <View
                key={level.id}
                style={[
                  styles.levelRow,
                  index < AGENT_REWARDS.levels.length - 1 && styles.levelBorder,
                ]}>
                <View style={[styles.levelDot, { backgroundColor: level.color }]} />
                <View style={styles.levelText}>
                  <Text style={[styles.levelName, active && styles.levelNameActive]}>
                    {level.name}
                  </Text>
                  <Text style={styles.levelMin}>
                    A partir de {level.minPoints.toLocaleString('pt-PT')} pts
                  </Text>
                </View>
                {active ? <Ionicons name="checkmark-circle" size={20} color={GOLD} /> : null}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Benefícios actuais</Text>
        <View style={styles.perksCard}>
          {AGENT_REWARDS.perks.map((perk) => (
            <View key={perk} style={styles.perkRow}>
              <Ionicons name="star" size={16} color={GOLD} />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 100,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: 18, paddingTop: 8 },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 24,
    marginTop: 28,
  },
  heroGradient: { ...StyleSheet.absoluteFill },
  points: { marginTop: 12, fontSize: 42, fontWeight: '800', color: '#FFFFFF' },
  pointsLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.65)' },
  levelBadge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(201,162,39,0.25)',
  },
  levelBadgeText: { fontSize: 12, fontWeight: '800', color: GOLD },
  progressTrack: {
    marginTop: 18,
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: GOLD },
  progressHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  levelsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  levelBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  levelDot: { width: 12, height: 12, borderRadius: 6 },
  levelText: { flex: 1 },
  levelName: { fontSize: 15, fontWeight: '700', color: '#374151' },
  levelNameActive: { color: NAVY },
  levelMin: { marginTop: 2, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  perksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perkText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
});
