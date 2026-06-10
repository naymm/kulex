import { StyleSheet, Text, View } from 'react-native';
import {
  formatKixikilaFeeSummary,
  getCycleTotalLabel,
  KIXIKILA_COMMISSION_MODES,
  KIXIKILA_FEE_RATE_LABELS,
  type KixikilaCommissionMode,
} from '@/constants/kixikila';

type Variant = 'light' | 'dark';

type Props = {
  contribution: string;
  members: string;
  commissionMode: KixikilaCommissionMode;
  frequency?: string;
  variant?: Variant;
  showModeNote?: boolean;
};

export function KixikilaFeeSummaryCard({
  contribution,
  members,
  commissionMode,
  frequency = 'Mensal',
  variant = 'light',
  showModeNote = true,
}: Props) {
  const summary = formatKixikilaFeeSummary(contribution, members, commissionMode);
  const modeConfig = KIXIKILA_COMMISSION_MODES.find((item) => item.id === commissionMode);
  const isDark = variant === 'dark';

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Resumo de taxas e comissões</Text>

      <FeeRow label={getCycleTotalLabel(frequency)} value={summary.monthlyTotal} variant={variant} />
      <FeeRow
        label={KIXIKILA_FEE_RATE_LABELS.serviceFee}
        value={summary.serviceFee}
        variant={variant}
      />
      <FeeRow
        label={KIXIKILA_FEE_RATE_LABELS.stampDuty}
        value={summary.stampDuty}
        variant={variant}
      />
      <FeeRow
        label={KIXIKILA_FEE_RATE_LABELS.ivaOnServiceFee}
        value={summary.ivaOnServiceFee}
        variant={variant}
      />
      <FeeRow
        label={KIXIKILA_FEE_RATE_LABELS.withholdingOnServiceFee}
        value={summary.withholdingOnServiceFee}
        variant={variant}
      />
      <FeeRow label="Total de comissões" value={summary.totalFees} variant={variant} bold />

      {commissionMode === 'deduct_from_pool' ? (
        <>
          <FeeRow
            label="Valor líquido na Kixikila"
            value={summary.poolAmount}
            variant={variant}
            bold
          />
          <FeeRow
            label="Débito por participante"
            value={summary.perMemberContribution}
            valueHint="contribuição"
            variant={variant}
            last
          />
        </>
      ) : (
        <>
          <FeeRow
            label="Comissão por participante"
            value={summary.perMemberCommission}
            valueHint="Comissão de Kixikila"
            variant={variant}
          />
          <FeeRow
            label="Débito total por participante"
            value={summary.perMemberTotalDebit}
            valueHint="contribuição + comissão"
            variant={variant}
            bold
            last
          />
        </>
      )}

      {showModeNote && modeConfig ? (
        <Text style={[styles.note, isDark && styles.noteDark]}>{modeConfig.description}</Text>
      ) : null}
    </View>
  );
}

function FeeRow({
  label,
  value,
  valueHint,
  variant,
  bold,
  last,
}: {
  label: string;
  value: string;
  valueHint?: string;
  variant: Variant;
  bold?: boolean;
  last?: boolean;
}) {
  const isDark = variant === 'dark';

  return (
    <View style={[styles.row, last && styles.rowLast, isDark && styles.rowDark]}>
      <Text style={[styles.label, isDark && styles.labelDark, bold && styles.bold]}>
        {label}
      </Text>
      <View style={styles.valueWrap}>
        <Text style={[styles.value, isDark && styles.valueDark, bold && styles.bold]}>
          {value}
        </Text>
        {valueHint ? (
          <Text style={[styles.valueHint, isDark && styles.valueHintDark]}>{valueHint}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  cardDark: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowDark: {
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  labelDark: {
    color: 'rgba(255,255,255,0.75)',
  },
  valueWrap: {
    alignItems: 'flex-end',
    maxWidth: '48%',
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  valueDark: {
    color: '#FFFFFF',
  },
  valueHint: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'right',
  },
  valueHintDark: {
    color: 'rgba(255,255,255,0.45)',
  },
  bold: {
    fontWeight: '800',
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
  },
  noteDark: {
    color: 'rgba(255,255,255,0.55)',
  },
});
