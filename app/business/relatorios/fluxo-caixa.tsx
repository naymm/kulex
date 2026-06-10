import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESS_CASH_FLOW_PROJECTION } from '@/constants/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

export default function BusinessFluxoCaixaScreen() {
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
          <Text style={styles.headerTitle}>Fluxo de caixa</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Projecção baseada no histórico de recebimentos da loja.</Text>
        {BUSINESS_CASH_FLOW_PROJECTION.map((item) => (
          <View key={item.month} style={styles.row}>
            <View>
              <Text style={styles.month}>{item.month}</Text>
              <Text style={styles.confidence}>Confiança: {item.confidence}</Text>
            </View>
            <Text style={styles.projected}>{item.projected}</Text>
          </View>
        ))}
      </ScrollView>
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
  intro: { marginBottom: 16, fontSize: 14, color: '#6B7280' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  month: { fontSize: 16, fontWeight: '700', color: '#111827' },
  confidence: { marginTop: 4, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  projected: { fontSize: 16, fontWeight: '800', color: TEAL },
});
