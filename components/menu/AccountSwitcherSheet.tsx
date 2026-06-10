import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { KulexAccount } from '@/constants/accounts';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';

type AccountAvatarProps = {
  account: KulexAccount;
  size?: number;
  style?: ViewStyle | ImageStyle;
};

export function AccountAvatar({ account, size = 52, style }: AccountAvatarProps) {
  if (account.avatar) {
    return (
      <Image
        source={account.avatar}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.25)',
          },
          style as ImageStyle,
        ]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: account.color,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.25)',
        },
        style as ViewStyle,
      ]}>
      <Text style={[styles.initials, { fontSize: size * 0.32 }]}>{account.initials}</Text>
    </View>
  );
}

type AccountSwitcherSheetProps = {
  visible: boolean;
  accounts: KulexAccount[];
  activeAccountId: string;
  onClose: () => void;
  onSelect: (accountId: string) => void;
};

export function AccountSwitcherSheet({
  visible,
  accounts,
  activeAccountId,
  onClose,
  onSelect,
}: AccountSwitcherSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>As suas contas</Text>
          <Text style={styles.subtitle}>Seleccione a conta que pretende utilizar</Text>

          {accounts.map((account) => {
            const selected = account.id === activeAccountId;

            return (
              <Pressable
                key={account.id}
                style={[styles.accountRow, selected && styles.accountRowSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  if (account.id === activeAccountId) {
                    onClose();
                    return;
                  }
                  onClose();
                  onSelect(account.id);
                }}>
                <AccountAvatar account={account} size={48} style={styles.rowAvatar} />
                <View style={styles.accountText}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountType}>{account.accountType}</Text>
                  <Text style={styles.accountBalance}>{account.balance}</Text>
                </View>
                {selected ? (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                )}
              </Pressable>
            );
          })}

          <Pressable
            style={styles.addBtn}
            accessibilityRole="button"
            onPress={() => {
              onClose();
              router.push('/signup/account-type');
            }}>
            <Ionicons name="add-circle-outline" size={20} color={NAVY} />
            <Text style={styles.addBtnText}>Abrir nova conta</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 18,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accountRowSelected: {
    borderColor: GOLD,
    backgroundColor: '#FFFBEB',
  },
  rowAvatar: {
    borderColor: '#E5E7EB',
  },
  accountText: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  accountType: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: NAVY,
  },
  accountBalance: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addBtn: {
    marginTop: 8,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
});
