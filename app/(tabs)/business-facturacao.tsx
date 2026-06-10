import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESS_PROFILE } from '@/constants/business';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

export default function BusinessFacturacaoTabScreen() {
  const insets = useSafeAreaInsets();
  const remaining = BUSINESS_PROFILE.simplifiedInvoicesLimit - BUSINESS_PROFILE.simplifiedInvoicesUsed;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Facturação</Text>
        <Text style={styles.headerSubtitle}>Emitir e gerir facturas</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.createBtn}
          accessibilityRole="button"
          onPress={() => router.push('/business/facturacao/criar')}>
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Criar nova factura</Text>
        </Pressable>

        <Pressable
          style={styles.invoiceCard}
          accessibilityRole="button"
          onPress={() => router.push('/business/facturacao/criar?type=simplified')}>
          <View style={[styles.iconWrap, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="document-text-outline" size={28} color="#16A34A" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Factura simplificada</Text>
            <Text style={styles.cardSubtitle}>
              Empresário em nome individual · Isenta de IVA · Portal do Contribuinte
            </Text>
            <Text style={styles.cardMeta}>
              {remaining} de {BUSINESS_PROFILE.simplifiedInvoicesLimit} restantes este ano
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
        </Pressable>

        <Pressable
          style={styles.invoiceCard}
          accessibilityRole="button"
          onPress={() => router.push('/business/facturacao/criar?type=normal')}>
          <View style={[styles.iconWrap, { backgroundColor: '#EEF0F8' }]}>
            <Ionicons name="receipt-outline" size={28} color={NAVY} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Factura normal</Text>
            <Text style={styles.cardSubtitle}>
              Regime geral (14%), taxa reduzida (5%) ou isento (0%)
            </Text>
            <Text style={styles.cardMeta}>Cálculo automático de IVA e total</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
        </Pressable>

        <Pressable
          style={styles.linkBtn}
          accessibilityRole="button"
          onPress={() => router.push('/business/relatorios/facturas')}>
          <Ionicons name="documents-outline" size={22} color={TEAL} />
          <Text style={styles.linkBtnText}>Relatório de facturas emitidas</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: 18, paddingTop: 8, gap: 12 },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 14,
    backgroundColor: NAVY,
    marginBottom: 4,
  },
  createBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  invoiceCard: {
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
  cardText: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  cardSubtitle: { marginTop: 4, fontSize: 13, lineHeight: 18, fontWeight: '500', color: '#6B7280' },
  cardMeta: { marginTop: 8, fontSize: 12, fontWeight: '700', color: TEAL },
  linkBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  linkBtnText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111827' },
});
