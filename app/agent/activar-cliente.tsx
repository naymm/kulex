import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AGENT_CLIENT_ACTIVATION_REQUIREMENTS } from '@/constants/agent';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';

export default function ActivarClienteScreen() {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.headerTitle}>Activar cliente</Text>
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
          <View style={styles.heroIcon}>
            <Ionicons name="person-add-outline" size={32} color={NAVY} />
          </View>
          <Text style={styles.heroTitle}>Abertura de conta pessoal</Text>
          <Text style={styles.heroSubtitle}>
            Os requisitos são os mesmos da abertura de conta pessoal na Kulex. O cliente
            completa o KYC e define o PIN antes de começar a operar.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Requisitos</Text>
        <View style={styles.requirementsCard}>
          {AGENT_CLIENT_ACTIVATION_REQUIREMENTS.map((item, index) => (
            <View
              key={item}
              style={[
                styles.requirementRow,
                index < AGENT_CLIENT_ACTIVATION_REQUIREMENTS.length - 1 && styles.requirementBorder,
              ]}>
              <View style={styles.checkWrap}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.requirementText}>{item}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.primaryBtn}
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/signup',
              params: { context: 'agent-client' },
            })
          }>
          <Text style={styles.primaryBtnText}>Iniciar abertura de conta</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          accessibilityRole="button"
          onPress={() => router.push('/kyc')}>
          <Ionicons name="scan-outline" size={18} color={NAVY} />
          <Text style={styles.secondaryBtnText}>Continuar KYC pendente</Text>
        </Pressable>
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
  content: { paddingHorizontal: 18 },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center' },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#6B7280',
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
  requirementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  requirementBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
  primaryBtn: {
    marginTop: 24,
    height: 54,
    borderRadius: 27,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  secondaryBtn: {
    marginTop: 12,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: '#FFFBEB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: NAVY },
});
