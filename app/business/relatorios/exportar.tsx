import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

const FORMATS = [
  { id: 'csv', label: 'CSV', subtitle: 'Compatível com Excel e contabilidade' },
  { id: 'pdf', label: 'PDF', subtitle: 'Relatório formatado para arquivo' },
  { id: 'saft', label: 'SAFT-AO', subtitle: 'Formato fiscal angolano' },
];

export default function BusinessExportarScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backBtn}
            onPress={() => goBackFromOrigin(undefined, () => router.back())}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Exportar contabilidade</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.intro}>
          Exporte extractos, facturas e movimentos para o seu contabilista.
        </Text>
        {FORMATS.map((format) => (
          <Pressable key={format.id} style={styles.formatCard} accessibilityRole="button">
            <View style={styles.formatIcon}>
              <Ionicons name="cloud-download-outline" size={24} color={TEAL} />
            </View>
            <View style={styles.formatText}>
              <Text style={styles.formatLabel}>{format.label}</Text>
              <Text style={styles.formatSubtitle}>{format.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: NAVY, paddingHorizontal: 20, paddingBottom: 16, overflow: 'hidden' },
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
  content: { padding: 18 },
  intro: { marginBottom: 16, fontSize: 14, lineHeight: 20, color: '#6B7280' },
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formatText: { flex: 1 },
  formatLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  formatSubtitle: { marginTop: 3, fontSize: 13, fontWeight: '500', color: '#6B7280' },
});
