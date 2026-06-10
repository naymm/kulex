import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { flagEmojiFromIso2 } from '@/constants/countries';
import { INCOMING_STATUS_LABELS } from '@/constants/remessas';
import { getIncomingRemittanceById } from '@/lib/remessas';

const NAVY = '#1A1A4E';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function RemessaRecebidaDetalheScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const item = typeof id === 'string' ? getIncomingRemittanceById(id) : undefined;

  if (!item) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Remessa não encontrada.</Text>
        </View>
      </View>
    );
  }

  const statusColor =
    item.status === 'creditado'
      ? '#22C55E'
      : item.status === 'em_processamento'
        ? '#F59E0B'
        : '#9CA3AF';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Remessa recebida</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroFlag}>{flagEmojiFromIso2(item.senderCountryCode)}</Text>
          <Text style={styles.heroAmount}>AOA {item.amountAoa}</Text>
          <Text style={styles.heroForeign}>
            {item.amountForeign} {item.currency}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {INCOMING_STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <DetailRow label="Remetente" value={item.senderName} />
          <DetailRow label="País de origem" value={item.senderCountry} />
          <DetailRow label="Referência" value={item.reference} />
          <DetailRow label="Data" value={item.dateLabel} />
          <DetailRow label="Destino" value={item.payoutMethod} />
          <DetailRow label="Montante recebido" value={`AOA ${item.amountAoa}`} />
          <DetailRow label="Valor em moeda estrangeira" value={`${item.amountForeign} ${item.currency}`} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: NAVY,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  hero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  heroFlag: {
    fontSize: 40,
    marginBottom: 8,
  },
  heroAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: NAVY,
  },
  heroForeign: {
    fontSize: 15,
    color: '#6B7280',
  },
  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 18,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 15,
    color: '#6B7280',
  },
});
