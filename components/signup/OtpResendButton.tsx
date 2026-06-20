import { Pressable, StyleSheet, Text } from 'react-native';
import { formatOtpResendCountdown } from '@/hooks/useOtpResendCooldown';

type Props = {
  secondsLeft: number;
  canResend: boolean;
  isResending?: boolean;
  onPress: () => void;
};

export function OtpResendButton({ secondsLeft, canResend, isResending = false, onPress }: Props) {
  const disabled = !canResend || isResending;

  let label = `Pedir novo código em ${formatOtpResendCountdown(secondsLeft)}`;
  if (canResend) {
    label = isResending ? 'A reenviar...' : 'Reenviar código';
  }

  return (
    <Pressable
      style={styles.resend}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.resendText, disabled && styles.resendTextDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  resend: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A4E',
  },
  resendTextDisabled: {
    color: '#9CA3AF',
  },
});
