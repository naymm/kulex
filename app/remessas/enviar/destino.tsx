import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { flagEmojiFromIso2 } from '@/constants/countries';
import {
  REMITTANCE_CORRIDORS,
  REMITTANCE_PAYOUT_LABELS,
  type RemittanceCorridor,
  type RemittancePayoutMethod,
} from '@/constants/remessas';
import { formatRateLabel } from '@/lib/remessas';
import { remessaParamsToRoute } from '@/lib/remessas-route';

export default function RemessaDestinoScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [corridorId, setCorridorId] = useState<string | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<RemittancePayoutMethod | null>(null);

  const corridor = useMemo(
    () => REMITTANCE_CORRIDORS.find((item) => item.id === corridorId),
    [corridorId],
  );

  const canContinue = Boolean(corridor && payoutMethod);

  return (
    <AddMoneyShell
      title="Enviar remessa"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          disabled={!canContinue}
          onPress={() => {
            if (!corridor || !payoutMethod) return;
            router.push({
              pathname: '/remessas/enviar/beneficiario',
              params: remessaParamsToRoute({
                from,
                corridorId: corridor.id,
                payoutMethod,
              }),
            });
          }}
        />
      }>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>País de destino</Text>
        <View style={styles.list}>
          {REMITTANCE_CORRIDORS.map((item) => (
            <CorridorRow
              key={item.id}
              item={item}
              selected={corridorId === item.id}
              onPress={() => {
                setCorridorId(item.id);
                setPayoutMethod(null);
              }}
            />
          ))}
        </View>

        {corridor ? (
          <>
            <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
              Forma de entrega
            </Text>
            <Text style={styles.rateHint}>{formatRateLabel(corridor)}</Text>
            <View style={styles.list}>
              {corridor.payoutMethods.map((method) => (
                <Pressable
                  key={method}
                  style={[styles.payoutRow, payoutMethod === method && styles.payoutRowSelected]}
                  accessibilityRole="button"
                  onPress={() => setPayoutMethod(method)}>
                  <Text style={styles.payoutLabel}>{REMITTANCE_PAYOUT_LABELS[method]}</Text>
                  {payoutMethod === method ? (
                    <Ionicons name="checkmark-circle" size={22} color="#4ADE80" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={22} color="rgba(255,255,255,0.35)" />
                  )}
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </AddMoneyShell>
  );
}

function CorridorRow({
  item,
  selected,
  onPress,
}: {
  item: RemittanceCorridor;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.corridorRow, selected && styles.corridorRowSelected]}
      accessibilityRole="button"
      onPress={onPress}>
      <Text style={styles.flag}>{flagEmojiFromIso2(item.countryCode)}</Text>
      <View style={styles.corridorInfo}>
        <Text style={styles.corridorName}>{item.countryName}</Text>
        <Text style={styles.corridorCurrency}>{item.currency}</Text>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={22} color="#4ADE80" />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 28,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionSpacing: {
    marginTop: 28,
  },
  rateHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  corridorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  corridorRowSelected: {
    borderColor: 'rgba(74,222,128,0.45)',
    backgroundColor: 'rgba(74,222,128,0.08)',
  },
  flag: {
    fontSize: 28,
  },
  corridorInfo: {
    flex: 1,
    gap: 2,
  },
  corridorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  corridorCurrency: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  payoutRowSelected: {
    borderColor: 'rgba(74,222,128,0.45)',
    backgroundColor: 'rgba(74,222,128,0.08)',
  },
  payoutLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
