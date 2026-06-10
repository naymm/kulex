import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESS_PROFILE } from '@/constants/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

export default function BusinessQrCodeScreen() {
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
          <Text style={styles.headerTitle}>QR Code da loja</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.qrPlaceholder}>
          <Ionicons name="qr-code" size={120} color={NAVY} />
        </View>
        <Text style={styles.storeName}>{BUSINESS_PROFILE.tradeName}</Text>
        <Text style={styles.storeMeta}>NIF {BUSINESS_PROFILE.nif}</Text>
        <Text style={styles.hint}>
          Peça ao cliente para escanear este código no balcão. O pagamento é creditado
          instantaneamente na conta da loja.
        </Text>
        <Pressable style={styles.shareBtn} accessibilityRole="button">
          <Ionicons name="share-outline" size={18} color="#FFFFFF" />
          <Text style={styles.shareBtnText}>Partilhar QR Code</Text>
        </Pressable>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Código estático</Text>
          <Text style={styles.codeValue}>KLX-BZ-{BUSINESS_PROFILE.nif.slice(-6)}</Text>
        </View>
      </View>
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
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 32 },
  qrPlaceholder: {
    width: 220,
    height: 220,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TEAL,

  },
  storeName: { marginTop: 24, fontSize: 20, fontWeight: '800', color: '#111827' },
  storeMeta: { marginTop: 6, fontSize: 14, fontWeight: '500', color: '#6B7280' },
  hint: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  shareBtn: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: NAVY,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 27,
  },
  shareBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  codeBox: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  codeLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  codeValue: { marginTop: 6, fontSize: 18, fontWeight: '800', color: NAVY, letterSpacing: 1 },
});
