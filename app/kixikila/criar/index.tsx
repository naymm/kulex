import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditSelectField } from '@/components/credit/CreditSelectField';
import { CreditTextField } from '@/components/credit/CreditTextField';
import { InsuranceSelectSheet } from '@/components/insurance/InsuranceSelectSheet';
import { KixikilaFeeSummaryCard } from '@/components/kixikila/KixikilaFeeSummaryCard';
import {
  getDefaultDuration,
  getDurationOptions,
  KIXIKILA_COMMISSION_MODES,
  KIXIKILA_CONTRIBUTION_PRESETS,
  KIXIKILA_DEBIT_DAY_OPTIONS,
  KIXIKILA_FREQUENCY_OPTIONS,
  KIXIKILA_MEMBER_OPTIONS,
  KIXIKILA_PROTECTION_OPTIONS,
  type KixikilaCommissionMode,
} from '@/constants/kixikila';

const NAVY = '#1A1A4E';

type SelectField = 'frequency' | 'members' | 'protection' | 'debitDay' | 'duration' | null;

export default function NovaKixikilaScreen() {
  const insets = useSafeAreaInsets();
  const [groupName, setGroupName] = useState('');
  const [amountDigits, setAmountDigits] = useState('');
  const [frequency, setFrequency] = useState<string>(KIXIKILA_FREQUENCY_OPTIONS[0]);
  const [members, setMembers] = useState<string>(KIXIKILA_MEMBER_OPTIONS[2]);
  const [protection, setProtection] = useState('');
  const [debitDay, setDebitDay] = useState('5');
  const [durationMonths, setDurationMonths] = useState(() => getDefaultDuration(Number(KIXIKILA_MEMBER_OPTIONS[2])));
  const [commissionMode, setCommissionMode] = useState<KixikilaCommissionMode>('deduct_from_pool');
  const [selectField, setSelectField] = useState<SelectField>(null);

  const durationOptions = useMemo(
    () => getDurationOptions(Number(members)).map((option) => option.value),
    [members]
  );

  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits]
  );

  const handleMembersChange = (value: string) => {
    setMembers(value);
    const nextDuration = getDefaultDuration(Number(value));
    setDurationMonths(nextDuration);
  };

  const selectConfig = {
    frequency: {
      title: 'Frequência',
      options: [...KIXIKILA_FREQUENCY_OPTIONS] as string[],
      value: frequency,
      onSelect: setFrequency,
    },
    members: {
      title: 'Quantos membros?',
      options: [...KIXIKILA_MEMBER_OPTIONS] as string[],
      value: members,
      onSelect: handleMembersChange,
    },
    protection: {
      title: 'Proteger-se contra falhas?',
      options: [...KIXIKILA_PROTECTION_OPTIONS] as string[],
      value: protection || KIXIKILA_PROTECTION_OPTIONS[0],
      onSelect: setProtection,
    },
    debitDay: {
      title: 'Dia útil do débito',
      options: KIXIKILA_DEBIT_DAY_OPTIONS.map((option) => option.value),
      value: debitDay,
      onSelect: setDebitDay,
    },
    duration: {
      title: 'Prazo de término',
      options: durationOptions,
      value: durationMonths,
      onSelect: setDurationMonths,
    },
  } as const;

  const activeSelect = selectField ? selectConfig[selectField] : null;

  const handleContinue = () => {
    router.push({
      pathname: '/kixikila/criar/membros',
      params: {
        groupName: groupName.trim() || 'Vendedoras Kikolo',
        contribution: amountFormatted || '100.000,00',
        frequency,
        members,
        protection: protection || KIXIKILA_PROTECTION_OPTIONS[0],
        debitDay,
        durationMonths,
        commissionMode,
      },
    });
  };

  const debitDayLabel =
    KIXIKILA_DEBIT_DAY_OPTIONS.find((option) => option.value === debitDay)?.label ?? `${debitDay}º dia útil`;
  const durationLabel =
    getDurationOptions(Number(members)).find((option) => option.value === durationMonths)?.label ??
    `${durationMonths} meses`;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Nova Kixikila</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <CreditTextField
          label="Nome do grupo"
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Ex: Vendedoras do kikolo"
        />

        <CreditTextField
          label="Contribuição por pessoa"
          value={amountFormatted}
          onChangeText={(text) => setAmountDigits(normalizeDigits(text))}
          placeholder="Kz 0,00"
          keyboardType="numeric"
          inputMode="numeric"
        />
        <View style={styles.chipsRow}>
          {KIXIKILA_CONTRIBUTION_PRESETS.map((preset) => {
            const selected = amountFormatted === preset;
            return (
              <Pressable
                key={preset}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setAmountDigits(presetToDigits(preset))}>
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {preset}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <CreditSelectField
          label="Frequência"
          value={frequency}
          onPress={() => setSelectField('frequency')}
        />
        <CreditSelectField
          label="Quantos membros?"
          value={members}
          onPress={() => setSelectField('members')}
        />
        <CreditSelectField
          label="Dia útil do débito"
          value={debitDayLabel}
          onPress={() => setSelectField('debitDay')}
        />
        <CreditSelectField
          label="Prazo de término"
          value={durationLabel}
          onPress={() => setSelectField('duration')}
        />
        <CreditSelectField
          label="Proteger-se contra falhas?"
          value={protection}
          placeholder="Seleccione uma opção"
          onPress={() => setSelectField('protection')}
        />

        <Text style={styles.sectionTitle}>Como cobrar as comissões?</Text>
        <View style={styles.modeList}>
          {KIXIKILA_COMMISSION_MODES.map((option) => {
            const selected = commissionMode === option.id;
            return (
              <Pressable
                key={option.id}
                style={[styles.modeCard, selected && styles.modeCardSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCommissionMode(option.id)}>
                <View style={styles.modeText}>
                  <Text style={styles.modeLabel}>{option.label}</Text>
                  <Text style={styles.modeDescription}>{option.description}</Text>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.feeCardWrap}>
          <KixikilaFeeSummaryCard
            contribution={amountFormatted || '0'}
            members={members}
            commissionMode={commissionMode}
            frequency={frequency}
          />
          <Text style={styles.feeHint}>
            A Kixikila só inicia quando todos os {members} membros estiverem completos.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.primaryBtn} accessibilityRole="button" onPress={handleContinue}>
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </Pressable>
      </View>

      {activeSelect ? (
        <InsuranceSelectSheet
          visible={selectField !== null}
          title={activeSelect.title}
          options={
            selectField === 'debitDay'
              ? KIXIKILA_DEBIT_DAY_OPTIONS.map((option) => option.label)
              : selectField === 'duration'
                ? getDurationOptions(Number(members)).map((option) => option.label)
                : activeSelect.options
          }
          selected={
            selectField === 'debitDay'
              ? debitDayLabel
              : selectField === 'duration'
                ? durationLabel
                : activeSelect.value
          }
          onClose={() => setSelectField(null)}
          onSelect={(value) => {
            if (selectField === 'debitDay') {
              const match = KIXIKILA_DEBIT_DAY_OPTIONS.find((option) => option.label === value);
              if (match) setDebitDay(match.value);
            } else if (selectField === 'duration') {
              const match = getDurationOptions(Number(members)).find((option) => option.label === value);
              if (match) setDurationMonths(match.value);
            } else {
              activeSelect.onSelect(value);
            }
            setSelectField(null);
          }}
        />
      ) : null}
    </View>
  );
}

function normalizeDigits(text: string) {
  return text.replace(/[^\d]/g, '').slice(0, 12);
}

function presetToDigits(preset: string) {
  return preset.replace(/[^\d]/g, '');
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
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
    gap: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
  },
  chipSelected: {
    backgroundColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  chipTextSelected: {
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  modeList: {
    gap: 10,
    marginBottom: 16,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modeCardSelected: {
    borderColor: '#C9A227',
    backgroundColor: '#FFFBEB',
  },
  modeText: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  modeDescription: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 17,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioSelected: {
    borderColor: '#C9A227',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C9A227',
  },
  feeCardWrap: {
    marginTop: 4,
    marginBottom: 8,
  },
  feeHint: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
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
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
