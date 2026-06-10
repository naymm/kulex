import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { flagEmojiFromIso2 } from '@/constants/countries';
import {
  buildRemittanceSummary,
  generateRemittanceTrackingRef,
  getCorridorById,
  registerOutgoingRemittance,
} from '@/lib/remessas';
import { parseRemessaParams } from '@/lib/remessas-route';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function RemessaSucessoScreen() {
  const params = parseRemessaParams(useLocalSearchParams());
  const trackingRef = useMemo(() => generateRemittanceTrackingRef(), []);

  const corridor = useMemo(
    () => (params.corridorId ? getCorridorById(params.corridorId) : undefined),
    [params.corridorId],
  );

  const feeMode = params.feeMode ?? 'add';
  const summary = useMemo(
    () => buildRemittanceSummary(params.amountDigits ?? '', params.corridorId ?? '', feeMode),
    [params.amountDigits, params.corridorId, feeMode],
  );

  useEffect(() => {
    if (!params.corridorId || !params.amountDigits || !params.beneficiaryName || !params.payoutMethod) {
      return;
    }
    registerOutgoingRemittance({
      beneficiaryName: params.beneficiaryName,
      corridorId: params.corridorId,
      payoutMethod: params.payoutMethod,
      amountDigits: params.amountDigits,
      trackingRef,
      feeMode,
    });
  }, [
    feeMode,
    params.amountDigits,
    params.beneficiaryName,
    params.corridorId,
    params.payoutMethod,
    trackingRef,
  ]);

  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(16);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 14, stiffness: 140 });
    circleOpacity.value = withTiming(1, { duration: 280 });
    checkScale.value = withDelay(220, withSpring(1, { damping: 11, stiffness: 180 }));
    checkOpacity.value = withDelay(220, withTiming(1, { duration: 200 }));
    contentOpacity.value = withDelay(420, withTiming(1, { duration: 350 }));
    contentTranslateY.value = withDelay(420, withSpring(0, { damping: 16, stiffness: 120 }));
  }, [checkOpacity, checkScale, circleOpacity, circleScale, contentOpacity, contentTranslateY]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <AddMoneyShell
      hideHeader
      footer={
        <AddMoneyPrimaryButton label="Concluir" onPress={() => router.dismissTo('/(tabs)')} />
      }>
      <View style={styles.center}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.title}>Remessa enviada!</Text>
          <Text style={styles.subtitle}>
            O beneficiário será notificado quando o valor estiver disponível.
          </Text>

          <View style={styles.detailsCard}>
            {corridor ? (
              <View style={styles.destinationRow}>
                <Text style={styles.flag}>{flagEmojiFromIso2(corridor.countryCode)}</Text>
                <Text style={styles.destinationName}>{corridor.countryName}</Text>
              </View>
            ) : null}

            <DetailRow label="Código de acompanhamento" value={trackingRef} />
            <DetailRow label="Beneficiário" value={params.beneficiaryName ?? '—'} />
            <DetailRow label="Aplicação da taxa" value={summary.feeModeLabel} />
            <DetailRow label="Total debitado" value={`AOA ${summary.totalFormatted}`} />
            <DetailRow
              label="Beneficiário recebe"
              value={`${summary.foreignFormatted} ${summary.foreignCurrency}`}
            />

            <View style={styles.statusRow}>
              <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.65)" />
              <Text style={styles.statusText}>Entrega estimada: 1–3 dias úteis</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsCard: {
    marginTop: 28,
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 20,
    gap: 16,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  flag: {
    fontSize: 24,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statusText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
});
