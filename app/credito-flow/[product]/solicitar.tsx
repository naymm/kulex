import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditTextField } from '@/components/credit/CreditTextField';
import { CreditoFlowHeader, NAVY } from '@/components/credito-flow/CreditoFlowHeader';

function titleFromKey(key: string) {
  switch (key) {
    case 'maka-zero':
      return 'Maka Zero';
    case 'empreendedor':
      return 'Empreendedor';
    case 'familia':
      return 'Família';
    default:
      return 'Maka Zero';
  }
}

export default function CreditSolicitar() {
  const insets = useSafeAreaInsets();
  const { product } = useLocalSearchParams<{ product?: string }>();
  const key = typeof product === 'string' ? product : 'maka-zero';
  const title = useMemo(() => titleFromKey(key), [key]);

  const [amountDigits, setAmountDigits] = useState('');
  const [prazo, setPrazo] = useState<'30' | '60'>('30');

  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits]
  );

  return (
    <View style={styles.container}>
      <CreditoFlowHeader title={title} icon="speedometer-outline" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 12) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <CreditTextField
          label="Montante a solicitar"
          value={amountFormatted}
          onChangeText={(t) => setAmountDigits(normalizeDigits(t))}
          placeholder="0,00"
          keyboardType="numeric"
          inputMode="numeric"
        />

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaText}>Mín: 2 000,00</Text>
            <Text style={styles.metaText}>Máx: 50 000,00</Text>
          </View>
          <View style={styles.rightMeta}>
            <Text style={styles.metaText}>Plafond disponível:</Text>
            <Text style={styles.plafond}>10.000,00</Text>
          </View>
        </View>

        <Text style={[styles.blockTitle, { marginTop: 2 }]}>Prazo</Text>
        <View style={styles.prazoWrap}>
          <Pressable
            onPress={() => setPrazo('30')}
            style={[styles.prazoBtn, prazo === '30' && styles.prazoBtnActive]}
          >
            <Text style={[styles.prazoText, prazo === '30' && styles.prazoTextActive]}>
              30 dias
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPrazo('60')}
            style={[styles.prazoBtn, prazo === '60' && styles.prazoBtnActive]}
          >
            <Text style={[styles.prazoText, prazo === '60' && styles.prazoTextActive]}>
              60 dias
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.blockTitle, { marginTop: 18 }]}>Taxas</Text>
        <FeeRow label="Comissão de Utilização" value="15%" />
        <FeeRow label="IVA (Sobre Comissão)" value="14%" />
        <FeeRow label="Juro de Mora" value="4%" />
        <FeeRow label="TAEG" value="105%" />

        <Pressable
          style={styles.primaryBtn}
          onPress={() =>
            router.push({
              pathname: '/credito-flow/[product]/resumo-plano',
              params: { product: key },
            })
          }
        >
          <Text style={styles.primaryText}>Continuar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.feeRow}>
      <Text style={styles.feeLabel}>{label}</Text>
      <Text style={styles.feeValue}>{value}</Text>
    </View>
  );
}

function normalizeDigits(text: string) {
  const digits = text.replace(/[^\d]/g, '');
  return digits.slice(0, 12);
}

function formatMoneyFromDigitsAsCents(digits: string) {
  if (!digits) return '';
  const cents = Number(digits);
  if (!Number.isFinite(cents)) return '';
  return (cents / 100).toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 22 },
  blockTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 8 },
  metaRow: {
    marginTop: -8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaText: { fontSize: 12, color: '#6B7280', fontWeight: '500', lineHeight: 16 },
  rightMeta: { alignItems: 'flex-end' },
  plafond: { marginTop: 2, fontSize: 12, color: '#111827', fontWeight: '800' },
  prazoWrap: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 4,
  },
  prazoBtn: {
    flex: 1,
    height: 36,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prazoBtnActive: { backgroundColor: '#FFFFFF' },
  prazoText: { fontSize: 13, fontWeight: '700', color: '#111827' },
  prazoTextActive: { color: '#000000' },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  feeLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  feeValue: { fontSize: 12, color: '#111827', fontWeight: '800' },
  primaryBtn: {
    marginTop: 28,
    height: 54,
    borderRadius: 27,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
