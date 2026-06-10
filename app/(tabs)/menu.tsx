import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountAvatar, AccountSwitcherSheet } from '@/components/menu/AccountSwitcherSheet';
import { MenuRow } from '@/components/menu/MenuRow';
import { MENU_SECTIONS, type MenuItem } from '@/constants/menu';
import { useActiveAccount } from '@/contexts/AccountContext';
import { logoutToLogin, pushFromMenu } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';

type ToggleState = {
  biometric: boolean;
  twoFactor: boolean;
  location: boolean;
};

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const { accounts, activeAccount, activeAccountId, switchAccount } = useActiveAccount();
  const [accountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [toggles, setToggles] = useState<ToggleState>({
    biometric: true,
    twoFactor: false,
    location: true,
  });

  const handleToggle = (key: keyof ToggleState, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
  };

  const handleItemPress = (item: MenuItem) => {
    const { action } = item;

    if (action.type === 'logout') {
      Alert.alert('Terminar sessão', 'Deseja sair da sua conta Kulex?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logoutToLogin },
      ]);
      return;
    }

    if (action.type === 'toggle') return;

    if (action.type === 'info') {
      Alert.alert(item.title, action.message);
      return;
    }

    if (action.type === 'route') {
      pushFromMenu(action.href);
    }
  };

  const copyMembershipId = () => {
    Alert.alert('Copiado', `ID ${activeAccount.membershipId} copiado para a área de transferência.`);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.profileRow}>
          <Pressable
            style={styles.profilePressable}
            accessibilityRole="button"
            accessibilityLabel="Trocar conta"
            onPress={() => setAccountSwitcherOpen(true)}>
            <AccountAvatar account={activeAccount} size={52} />
            <View style={styles.profileText}>
              <Text style={styles.userName}>{activeAccount.name}</Text>
              <View style={styles.accountTypeRow}>
                <Text style={styles.accountType}>{activeAccount.accountType}</Text>
                <View style={styles.switchBadge}>
                  <Ionicons name="swap-horizontal" size={12} color="#FFFFFF" />
                  <Text style={styles.switchBadgeText}>Trocar</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.7)" />
          </Pressable>
          <Pressable style={styles.notifyBtn} accessibilityRole="button">
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.55)" />
          <Text style={styles.searchPlaceholder}>Pesquisar na Kulex</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.menuCard}>
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <View
              key={section.id}
              style={[
                styles.section,
                sectionIndex < MENU_SECTIONS.length - 1 && styles.sectionSpacing,
              ]}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, index) => {
                if (item.action.type === 'toggle') {
                  const toggleKey = item.action.key;
                  return (
                    <MenuRow
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      icon={item.icon}
                      iconBg={item.iconBg}
                      iconColor={item.iconColor}
                      destructive={item.destructive}
                      showChevron={false}
                      toggleValue={toggles[toggleKey]}
                      onToggle={(value) => handleToggle(toggleKey, value)}
                      last={index === section.items.length - 1}
                    />
                  );
                }

                return (
                  <MenuRow
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    icon={item.icon}
                    iconBg={item.iconBg}
                    iconColor={item.iconColor}
                    destructive={item.destructive}
                    onPress={() => handleItemPress(item)}
                    last={index === section.items.length - 1}
                  />
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.membershipCard}>
          <View style={styles.membershipHeader}>
            <Text style={styles.membershipLabel}>ID Kulex</Text>
            <Pressable
              style={styles.copyBtn}
              accessibilityRole="button"
              onPress={copyMembershipId}>
              <Text style={styles.copyBtnText}>Copiar</Text>
            </Pressable>
          </View>
          <Text style={styles.membershipValue}>{activeAccount.membershipId}</Text>
          <Text style={styles.balanceText}>Saldo: {activeAccount.balance}</Text>
          <Text style={styles.versionText}>Kulex v1.0.0</Text>
        </View>
      </ScrollView>

      <AccountSwitcherSheet
        visible={accountSwitcherOpen}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onClose={() => setAccountSwitcherOpen(false)}
        onSelect={switchAccount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  profilePressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  accountTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 3,
  },
  accountType: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
  },
  switchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(201,162,39,0.35)',
  },
  switchBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notifyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrap: {
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
  },
  scroll: {
    flex: 1,
    marginTop: -18,
  },
  content: {
    paddingHorizontal: 18,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  section: {
    paddingTop: 8,
  },
  sectionSpacing: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  membershipCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membershipLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: GOLD,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: NAVY,
  },
  membershipValue: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: 0.4,
  },
  balanceText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  versionText: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
});
