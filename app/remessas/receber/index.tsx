import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  INCOMING_STATUS_LABELS,
  RECEIVE_REMITTANCE_ACCOUNT,
} from '@/constants/remessas';
import { flagEmojiFromIso2 } from '@/constants/countries';
import { getAllIncomingRemittances } from '@/lib/remessas';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const HORIZONTAL_PADDING = 20;

function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(value.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.fieldRow} accessibilityRole="button" onPress={copy}>
        <Text style={styles.fieldValue}>{value}</Text>
        <Ionicons
          name={copied ? 'checkmark' : 'copy-outline'}
          size={18}
          color={copied ? '#22C55E' : NAVY}
        />
      </Pressable>
    </View>
  );
}

export default function RemessaReceberScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const recent = getAllIncomingRemittances().slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => goBackFromOrigin(from, () => router.back())}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Receber remessa</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Partilhe estes dados com quem envia dinheiro para si a partir do exterior.
        </Text>

        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountIcon}>
              <Ionicons name="wallet-outline" size={22} color={NAVY} />
            </View>
            <View>
              <Text style={styles.accountTitle}>Conta Kulex</Text>
              <Text style={styles.accountHolder}>{RECEIVE_REMITTANCE_ACCOUNT.holder}</Text>
            </View>
          </View>

          <CopyableField label="IBAN" value={RECEIVE_REMITTANCE_ACCOUNT.iban} />
          <CopyableField label="Número de conta" value={RECEIVE_REMITTANCE_ACCOUNT.accountNumber} />
          <CopyableField label="Banco" value={RECEIVE_REMITTANCE_ACCOUNT.bank} />
          <CopyableField label="SWIFT / BIC" value={RECEIVE_REMITTANCE_ACCOUNT.swift} />
          <CopyableField label="ID Kulex" value={RECEIVE_REMITTANCE_ACCOUNT.membershipId} />
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={20} color={NAVY} />
          <Text style={styles.tipText}>
            Remessas em processamento são creditadas automaticamente na sua conta Kulex após
            validação.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Remessas recentes</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/remessas/historico', params: { tab: 'recebidas' } })}>
            <Text style={styles.sectionLink}>Ver tudo</Text>
          </Pressable>
        </View>

        {recent.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Ainda não recebeu remessas.</Text>
          </View>
        ) : (
          recent.map((item) => (
            <Pressable
              key={item.id}
              style={styles.remittanceRow}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/remessas/historico/recebida/[id]',
                  params: { id: item.id },
                })
              }>
              <Text style={styles.rowFlag}>{flagEmojiFromIso2(item.senderCountryCode)}</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{item.senderName}</Text>
                <Text style={styles.rowMeta}>
                  {item.senderCountry} · {item.dateLabel}
                </Text>
              </View>
              <View style={styles.rowAmount}>
                <Text style={styles.rowAoa}>AOA {item.amountAoa}</Text>
                <Text
                  style={[
                    styles.rowStatus,
                    item.status === 'creditado' && styles.rowStatusDone,
                    item.status === 'em_processamento' && styles.rowStatusPending,
                  ]}>
                  {INCOMING_STATUS_LABELS[item.status]}
                </Text>
              </View>
            </Pressable>
          ))
        )}
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
    paddingHorizontal: HORIZONTAL_PADDING,
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 24,
    gap: 16,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#1A1A4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF0F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NAVY,
  },
  accountHolder: {
    marginTop: 2,
    fontSize: 13,
    color: '#6B7280',
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#EEF0F8',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#4B5563',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: NAVY,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  remittanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  rowFlag: {
    fontSize: 26,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
  },
  rowMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  rowAmount: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowAoa: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
  rowStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  rowStatusDone: {
    color: '#22C55E',
  },
  rowStatusPending: {
    color: '#F59E0B',
  },
});
