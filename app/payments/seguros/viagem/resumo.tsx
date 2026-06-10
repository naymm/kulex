import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InsuranceProgressStepper } from '@/components/insurance/InsuranceProgressStepper';
import { DEFAULT_POLICYHOLDER } from '@/constants/automovel-insurance';
import { DEFAULT_TRAVEL_FORM, VIAGEM_INSURANCE_STEPS } from '@/constants/viagem-insurance';

const NAVY = '#1A1A4E';

export default function ViagemInsuranceResumoScreen() {
  const insets = useSafeAreaInsets();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const travel = DEFAULT_TRAVEL_FORM;
  const holder = DEFAULT_POLICYHOLDER;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.brand}>PROTTEJA SEGUROS</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 120 },
        ]}
        showsVerticalScrollIndicator={false}>
        <InsuranceProgressStepper steps={VIAGEM_INSURANCE_STEPS} currentStep={3} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados da Viagem</Text>
          <SummaryGrid
            rows={[
              [
                { label: 'Origem', value: travel.origem },
                { label: 'Destino', value: travel.destino },
              ],
              [
                { label: 'Início', value: '2026-08-02' },
                { label: 'Fim', value: '2026-10-04' },
              ],
              [
                { label: 'Adultos', value: travel.adultos },
                { label: 'Crianças', value: travel.criancas },
              ],
            ]}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tomador do Seguro</Text>
          <SummaryGrid
            rows={[
              [
                { label: 'Nome', value: holder.nome },
                { label: 'Telemóvel', value: holder.telefone },
              ],
              [
                { label: 'Data de Nascimento', value: '2001-06-04' },
                { label: 'Género', value: holder.genero },
              ],
              [{ label: 'Número Documento', value: holder.documento, full: true }],
              [{ label: 'Morada', value: holder.morada, full: true }],
              [{ label: 'Email', value: holder.email, full: true }],
            ]}
          />
        </View>

        <Pressable
          style={styles.termsRow}
          onPress={() => setAcceptedTerms((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedTerms }}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
          </View>
          <Text style={styles.termsText}>
            Concordo com os <Text style={styles.termsLink}>termos e condições</Text>
          </Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={[styles.primaryBtn, !acceptedTerms && styles.primaryBtnDisabled]}
          disabled={!acceptedTerms}
          onPress={() => router.push('/payments/seguros/viagem/pagamento')}
          accessibilityRole="button">
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SummaryGrid({
  rows,
}: {
  rows: Array<Array<{ label: string; value: string; full?: boolean }>>;
}) {
  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.gridRow}>
          {row.map((item) => (
            <View key={item.label} style={[styles.gridItem, item.full && styles.gridItemFull]}>
              <Text style={styles.gridLabel}>{item.label}</Text>
              <Text style={styles.gridValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: { width: 40, height: 40 },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    gap: 14,
  },
  card: {
    marginTop: 18,
    backgroundColor: '#EEF0F8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  grid: { gap: 12 },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
  gridItemFull: {
    flex: 1,
    width: '100%',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  gridValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: NAVY,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
