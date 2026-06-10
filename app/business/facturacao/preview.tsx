import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { InvoicePreviewPayload } from '@/lib/business-invoice';
import { BUSINESS_PROFILE, INVOICE_TYPES } from '@/constants/business';
import {
  computeInvoiceSummary,
  formatCents,
  lineItemValueCents,
} from '@/lib/business-invoice';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

export default function BusinessFacturaPreviewScreen() {
  const insets = useSafeAreaInsets();
  const { payload } = useLocalSearchParams<{ payload?: string }>();

  const draft = useMemo<InvoicePreviewPayload | null>(() => {
    if (!payload) return null;
    try {
      return JSON.parse(payload) as InvoicePreviewPayload;
    } catch {
      return null;
    }
  }, [payload]);

  if (!draft) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Factura indisponível</Text>
      </View>
    );
  }

  const summary = computeInvoiceSummary(
    draft.items,
    draft.discountDigits,
    draft.vatRegime,
    draft.invoiceType,
  );
  const typeLabel = INVOICE_TYPES.find((t) => t.id === draft.invoiceType)?.label ?? 'Factura';
  const dueDateLabel = draft.dueDate
    ? new Date(draft.dueDate).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => goBackFromOrigin(undefined, () => router.back())}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Visualização da factura</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 100 },
        ]}>
        <View style={styles.previewCard}>
          <Text style={styles.issuerName}>{BUSINESS_PROFILE.tradeName}</Text>
          <Text style={styles.issuerMeta}>
            {BUSINESS_PROFILE.location} · NIF {BUSINESS_PROFILE.nif}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.typeBadge}>{typeLabel}</Text>
          <Text style={styles.invoiceTitle}>{draft.title}</Text>

          <View style={styles.metaGrid}>
            <MetaItem label="Cliente" value={draft.clientName} />
            {draft.clientEmail ? (
              <MetaItem label="E-mail" value={draft.clientEmail} />
            ) : null}
            <MetaItem label="Vencimento" value={dueDateLabel} />
          </View>

          <Text style={styles.itemsTitle}>Itens</Text>
          {draft.items
            .filter((item) => item.description.trim())
            .map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {index + 1}. {item.description}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {item.quantity || '0'} × kz{' '}
                    {formatCents(Number(item.priceDigits) || 0)}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  kz {formatCents(lineItemValueCents(item))}
                </Text>
              </View>
            ))}

          <View style={styles.divider} />

          <TotalLine label="Subtotal" value={`kz ${summary.subtotalFormatted}`} />
          {summary.discountCents > 0 ? (
            <TotalLine label="Desconto" value={`- kz ${summary.discountFormatted}`} />
          ) : null}
          <TotalLine
            label={`IVA (${summary.rate}%)`}
            value={`kz ${summary.vatFormatted}`}
          />
          <TotalLine
            label="Total"
            value={`kz ${summary.totalFormatted}`}
            highlight
          />

          {draft.notes.trim() ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.notesTitle}>Nota adicional</Text>
              <Text style={styles.notesBody}>{draft.notes}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.emitBtn} onPress={() => router.replace('/(tabs)/business-facturacao')}>
          <Text style={styles.emitBtnText}>Emitir factura</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function TotalLine({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.totalRow}>
      <Text style={[styles.totalLabel, highlight && styles.totalLabelBold]}>{label}</Text>
      <Text style={[styles.totalValue, highlight && styles.totalValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: NAVY,
  },
  headerSpacer: { width: 40 },
  content: { padding: 18 },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  issuerName: { fontSize: 18, fontWeight: '800', color: NAVY },
  issuerMeta: { marginTop: 4, fontSize: 13, color: '#6B7280' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    color: TEAL,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  invoiceTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  metaGrid: { marginTop: 16, gap: 10 },
  metaItem: {},
  metaLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  metaValue: { marginTop: 2, fontSize: 14, fontWeight: '600', color: '#111827' },
  itemsTitle: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  itemMeta: { marginTop: 3, fontSize: 12, color: '#9CA3AF' },
  itemTotal: { fontSize: 14, fontWeight: '700', color: NAVY },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: { fontSize: 14, color: '#6B7280' },
  totalLabelBold: { fontWeight: '800', color: '#111827', fontSize: 16 },
  totalValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  totalValueBold: { fontWeight: '800', fontSize: 16, color: NAVY },
  notesTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 6 },
  notesBody: { fontSize: 14, lineHeight: 20, color: '#374151' },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  emitBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#6B7280' },
});
