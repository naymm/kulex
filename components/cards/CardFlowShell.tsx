import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

type Props = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  closeIcon?: 'close' | 'arrow-back';
};

export function CardFlowShell({
  title,
  children,
  footer,
  onClose,
  closeIcon = 'arrow-back',
}: Props) {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    goBackFromOrigin(from);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.headerBtn}
          accessibilityRole="button"
          onPress={handleClose}>
          <Ionicons name={closeIcon} size={20} color="#111827" />
        </Pressable>
        {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
      </View>

      <View style={styles.body}>{children}</View>

      {footer ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>{footer}</View>
      ) : null}
    </View>
  );
}

export function CardFlowPrimaryButton({
  label,
  onPress,
  disabled = false,
  hint,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <View style={styles.footerContent}>
      {hint ? <Text style={styles.footerHint}>{hint}</Text> : null}
      <Pressable
        style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}>
        <Text style={styles.primaryBtnText}>{label}</Text>
      </Pressable>
    </View>
  );
}

export { NAVY };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 34,
  },
  body: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    gap: 10,
  },
  footerHint: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  primaryBtn: {
    height: 54,
    borderRadius: 27,
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
