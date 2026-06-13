import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESS_PROFILE } from '@/constants/business';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

export default function BusinessReceberTabScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Receber e Pagar</Text>
        <Text style={styles.headerSubtitle}>{BUSINESS_PROFILE.tradeName}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.heroCard}
          accessibilityRole="button"
          onPress={() => router.push('/business/qr-code')}>
          <View style={styles.qrIcon}>
            <Ionicons name="qr-code-outline" size={48} color={TEAL} />
          </View>
          <Text style={styles.heroTitle}>QR Code da loja</Text>
          <Text style={styles.heroSubtitle}>
            Gere um código para receber pagamentos no balcão. O cliente escaneia e paga
            instantaneamente.
          </Text>
          <View style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Gerar QR Code</Text>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Pagar</Text>
        <Pressable
          style={styles.actionCard}
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/business-servicos')}>
          <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="flash-outline" size={28} color="#D97706" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Pagar Serviços</Text>
            <Text style={styles.actionSubtitle}>ENDE, TV, internet e outros</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
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
    paddingBottom: 24,
    zIndex: 1,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: 18, paddingTop: 8 },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 28,
  },
  qrIcon: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  heroBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  heroBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  actionSubtitle: { marginTop: 4, fontSize: 13, fontWeight: '500', color: '#6B7280' },
});
