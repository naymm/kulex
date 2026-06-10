import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { AccountAvatar } from '@/components/menu/AccountSwitcherSheet';
import type { KulexAccount } from '@/constants/accounts';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';

type Props = {
  visible: boolean;
  account: KulexAccount | null;
};

export function AccountSwitchOverlay({ visible, account }: Props) {
  if (!account) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <AccountAvatar account={account} size={64} />
          <ActivityIndicator style={styles.spinner} size="large" color={GOLD} />
          <Text style={styles.title}>A mudar de conta</Text>
          <Text style={styles.accountType}>{account.accountType}</Text>
          <Text style={styles.hint}>A preparar o seu espaço Kulex…</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,26,78,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  spinner: {
    marginTop: 20,
  },
  title: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '800',
    color: NAVY,
    textAlign: 'center',
  },
  accountType: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: GOLD,
    textAlign: 'center',
  },
  hint: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
