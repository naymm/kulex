import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Contact } from '@/constants/contacts';
import { goBackFromOrigin } from '@/lib/navigation';

const GRADIENT = ['#2A2A72', '#1A1A4E', '#121236'] as const;
const NAVY = '#1A1A4E';

type SendMoneyShellProps = {
  contact?: Contact;
  showContact?: boolean;
  children: ReactNode;
  footer?: ReactNode;
};

export function SendMoneyShell({
  contact,
  showContact = false,
  children,
  footer,
}: SendMoneyShellProps) {
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
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            accessibilityRole="button"
            onPress={() => goBackFromOrigin(from)}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Enviar Dinheiro</Text>
        </View>

        {showContact && contact ? (
          <View style={styles.contactRow}>
            {contact.avatarUri ? (
              <Image source={{ uri: contact.avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: contact.color }]}>
                <Text style={styles.avatarInitials}>{contact.initials}</Text>
              </View>
            )}
            <View style={styles.contactText}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.body}>{children}</View>
        {footer}
      </LinearGradient>
    </View>
  );
}

export function SendMoneyPrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.primaryBtn} accessibilityRole="button" onPress={onPress}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

export { GRADIENT, NAVY };

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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  contactText: { flex: 1 },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactPhone: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
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
  primaryBtnText: {
    color: NAVY,
    fontSize: 16,
    fontWeight: '700',
  },
});
