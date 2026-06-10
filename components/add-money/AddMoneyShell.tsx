import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBackFromOrigin } from '@/lib/navigation';

const GRADIENT = ['#2A2A72', '#1A1A4E', '#121236'] as const;
const NAVY = '#1A1A4E';

type AddMoneyShellProps = {
  title?: string;
  hideHeader?: boolean;
  children: ReactNode;
  footer?: ReactNode;
};

export function AddMoneyShell({ title, hideHeader = false, children, footer }: AddMoneyShellProps) {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...GRADIENT]}
        style={[
          styles.gradient,
          {
            paddingTop: insets.top + 12,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}>
        {!hideHeader ? (
          <View style={styles.header}>
            <Pressable
              style={styles.backBtn}
              accessibilityRole="button"
              onPress={() => goBackFromOrigin(from)}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </Pressable>
            {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
          </View>
        ) : null}
        <View style={styles.body}>{children}</View>
        {footer}
      </LinearGradient>
    </View>
  );
}

export function AddMoneyPrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.primaryBtnText, disabled && styles.primaryBtnTextDisabled]}>{label}</Text>
    </Pressable>
  );
}

export { NAVY };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121236' },
  gradient: { flex: 1, paddingHorizontal: 22 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backBtn: {
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
  body: { flex: 1 },
  primaryBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    color: NAVY,
    fontSize: 16,
    fontWeight: '700',
  },
  primaryBtnTextDisabled: {
    color: '#6B7280',
  },
});
