import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AnimatedReanimated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import type { PostpaidCardTierId } from '@/constants/postpaid-card';
import { formatMoneyFromDigitsAsCents, normalizeDigits } from '@/lib/money';
import { digitsToMoneyFormatted } from '@/lib/postpaid-bill';
import {
  getPlafondRangeForTier,
  isPlafondAtMaximum,
  validateNewPlafond,
} from '@/lib/postpaid-plafond';

const NAVY = '#1A1A4E';

type IncreasePlafondSheetProps = {
  visible: boolean;
  tierId: PostpaidCardTierId;
  currentPlafond: string;
  onClose: () => void;
  onConfirm: (newPlafond: string) => void;
};

type SheetStep = 'form' | 'success';

export function IncreasePlafondSheet({
  visible,
  tierId,
  currentPlafond,
  onClose,
  onConfirm,
}: IncreasePlafondSheetProps) {
  const insets = useSafeAreaInsets();
  const sheetY = useRef(new Animated.Value(640)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<SheetStep>('form');
  const [amountDigits, setAmountDigits] = useState('');
  const [successPlafond, setSuccessPlafond] = useState('');
  const [previousPlafond, setPreviousPlafond] = useState('');

  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const range = useMemo(() => getPlafondRangeForTier(tierId), [tierId]);
  const atMaximum = useMemo(
    () => isPlafondAtMaximum(tierId, currentPlafond),
    [tierId, currentPlafond],
  );

  const requestedPlafond = useMemo(
    () => digitsToMoneyFormatted(amountDigits),
    [amountDigits],
  );

  const validation = useMemo(
    () => validateNewPlafond(tierId, currentPlafond, requestedPlafond),
    [tierId, currentPlafond, requestedPlafond],
  );

  const amountPreview = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits || '0'),
    [amountDigits],
  );

  useEffect(() => {
    if (visible) {
      setStep('form');
      setAmountDigits('');
      setSuccessPlafond('');
      setPreviousPlafond('');
      setMounted(true);
      sheetY.setValue(640);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(sheetY, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
      return;
    }

    if (!mounted) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 640, duration: 320, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
        setStep('form');
      }
    });
  }, [visible, mounted, overlayOpacity, sheetY]);

  useEffect(() => {
    if (step !== 'success') return;

    circleScale.value = 0;
    circleOpacity.value = 0;
    checkScale.value = 0;
    checkOpacity.value = 0;
    contentOpacity.value = 0;

    circleScale.value = withSpring(1, { damping: 14, stiffness: 140 });
    circleOpacity.value = withTiming(1, { duration: 280 });
    checkScale.value = withDelay(220, withSpring(1, { damping: 11, stiffness: 180 }));
    checkOpacity.value = withDelay(220, withTiming(1, { duration: 200 }));
    contentOpacity.value = withDelay(420, withTiming(1, { duration: 350 }));
  }, [step, checkOpacity, checkScale, circleOpacity, circleScale, contentOpacity]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const successContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const addDigit = (digit: string) => {
    setAmountDigits((prev) => normalizeDigits(prev + digit));
  };

  const deleteDigit = () => {
    setAmountDigits((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (!validation.valid) return;
    setPreviousPlafond(currentPlafond);
    onConfirm(requestedPlafond);
    setSuccessPlafond(requestedPlafond);
    setStep('success');
  };

  const handleDismiss = () => {
    onClose();
  };

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={handleDismiss}>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={styles.overlayPress} onPress={step === 'form' ? handleDismiss : undefined} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: Math.max(insets.bottom, 16), transform: [{ translateY: sheetY }] },
        ]}>
        {step === 'success' ? (
          <View style={styles.successWrap}>
            <AnimatedReanimated.View style={[styles.checkCircle, circleStyle]}>
              <AnimatedReanimated.View style={checkStyle}>
                <Ionicons name="checkmark" size={42} color="#16A34A" />
              </AnimatedReanimated.View>
            </AnimatedReanimated.View>

            <AnimatedReanimated.View style={[styles.successContent, successContentStyle]}>
              <Text style={styles.successTitle}>Plafond aumentado com sucesso</Text>
              <Text style={styles.successSubtitle}>
                O seu novo plafond disponível é de AOA {successPlafond}.
              </Text>

              <View style={styles.successCard}>
                <View style={styles.successRow}>
                  <Text style={styles.successRowLabel}>Plafond anterior</Text>
                  <Text style={styles.successRowValue}>AOA {previousPlafond}</Text>
                </View>
                <View style={styles.successDivider} />
                <View style={styles.successRow}>
                  <Text style={styles.successRowLabel}>Novo plafond</Text>
                  <Text style={styles.successRowValueHighlight}>AOA {successPlafond}</Text>
                </View>
              </View>
            </AnimatedReanimated.View>

            <Pressable
              style={[styles.confirmBtn, styles.successConfirmBtn]}
              accessibilityRole="button"
              onPress={handleDismiss}>
              <Text style={styles.confirmBtnText}>Entendi</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.handle} />

            <Text style={styles.title}>Aumentar plafond</Text>
            <Text style={styles.subtitle}>
              Defina o novo valor dentro do intervalo permitido para o seu cartão.
            </Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Plafond actual</Text>
                <Text style={styles.infoValue}>AOA {currentPlafond}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Intervalo permitido</Text>
                <Text style={styles.infoValue}>AOA {range.rangeLabel}</Text>
              </View>
            </View>

            {atMaximum ? (
              <View style={styles.maxBox}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#047857" />
                <Text style={styles.maxText}>
                  Já atingiu o plafond máximo disponível para este cartão.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.amountLabel}>Novo plafond</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.currency}>AOA </Text>
                  <Text style={[styles.amount, !amountDigits && styles.amountEmpty]}>
                    {amountPreview}
                  </Text>
                </View>

                {validation.message && amountDigits ? (
                  <Text style={styles.errorText}>{validation.message}</Text>
                ) : (
                  <Text style={styles.hintText}>
                    O valor deve ser superior a AOA {currentPlafond} e até AOA {range.max}.
                  </Text>
                )}

                <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="light" />
              </>
            )}

            <Pressable
              style={[
                styles.confirmBtn,
                (atMaximum || !validation.valid || !amountDigits) && styles.confirmBtnDisabled,
              ]}
              accessibilityRole="button"
              disabled={atMaximum || !validation.valid || !amountDigits}
              onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Confirmar aumento</Text>
            </Pressable>

            <Pressable style={styles.cancelBtn} accessibilityRole="button" onPress={handleDismiss}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  overlayPress: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
  },
  infoCard: {
    marginTop: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
  maxBox: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  maxText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#047857',
    lineHeight: 18,
  },
  amountLabel: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  amountRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  amount: {
    fontSize: 36,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: -0.5,
  },
  amountEmpty: {
    color: '#D1D5DB',
  },
  hintText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  errorText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  confirmBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    marginTop: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  successWrap: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#BBF7D0',
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  successSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  successCard: {
    width: '100%',
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  successRow: {
    paddingVertical: 12,
  },
  successDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  successRowLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  successRowValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  successRowValueHighlight: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
  },
  successConfirmBtn: {
    alignSelf: 'stretch',
    width: '100%',
    marginTop: 24,
  },
});
