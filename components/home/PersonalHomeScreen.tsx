import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeMoreMenu } from '@/components/home/HomeMoreMenu';
import { AccountAvatar } from '@/components/menu/AccountSwitcherSheet';
import { useActiveAccount } from '@/contexts/AccountContext';
import { useCollapsibleHomeHeader } from '@/hooks/useCollapsibleHomeHeader';

const HERO_HEIGHT = 118;
const UNREAD_NOTIFICATIONS = 2;

const transactions = [
  {
    id: 1,
    type: 'income',
    name: 'Transferência recebida',
    description: 'João Silva',
    amount: '+15.000,00 kz',
    date: '25 Mai',
  },
  {
    id: 2,
    type: 'expense',
    name: 'Pagamento',
    description: 'Supermercado',
    amount: '-3.250,80 kz',
    date: '24 Mai',
  },
  {
    id: 3,
    type: 'expense',
    name: 'Transferência enviada',
    description: 'Maria Santos',
    amount: '-8.500,00 kz',
    date: '23 Mai',
  },
];

export function PersonalHomeScreen() {
  const insets = useSafeAreaInsets();
  const { activeAccount } = useActiveAccount();
  const [showBalance, setShowBalance] = useState(true);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [moreAnchor, setMoreAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const moreButtonRef = useRef<View>(null);

  const {
    scrollHandler,
    headerStyle,
    headerPaddingStyle,
    toolbarStyle,
    heroContentStyle,
    sheetLiftStyle,
    headerBorderStyle,
    expandedHeight,
    onHeroLayout,
  } = useCollapsibleHomeHeader(insets, HERO_HEIGHT);

  const balanceDisplay = showBalance ? activeAccount.balance : '•••••••• kz';

  const openMoreMenu = () => {
    moreButtonRef.current?.measureInWindow((x, y, width, height) => {
      setMoreAnchor({ x, y, width, height });
      setMoreMenuOpen(true);
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle, headerBorderStyle]}>
        <Animated.View style={[styles.headerGradient, headerPaddingStyle]}>
        <LinearGradient
          colors={['#12124a', '#1a1a5e', '#252570']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} />
          <Animated.View style={[styles.headerTop, toolbarStyle]}>
            <View style={styles.profileWrap}>
              <AccountAvatar account={activeAccount} size={48} />
              <View style={styles.avatarBadge} />
            </View>

            <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
              <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.55)" />
              <Text style={styles.searchPlaceholder}>Pesquisar</Text>
            </TouchableOpacity>

            <Pressable
              style={styles.bellBtn}
              accessibilityRole="button"
              accessibilityLabel="Notificações">
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              {UNREAD_NOTIFICATIONS > 0 ? (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{UNREAD_NOTIFICATIONS}</Text>
                </View>
              ) : null}
            </Pressable>
          </Animated.View>

          <Animated.View
            style={[styles.heroContent, heroContentStyle]}
            onLayout={onHeroLayout}>
            <View style={styles.balanceSection}>
              <TouchableOpacity
                style={styles.balanceLabel}
                onPress={() => setShowBalance(!showBalance)}
                activeOpacity={0.7}>
                <Text style={styles.balanceLabelText}>Saldo Disponível</Text>
                <Ionicons
                  name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#b8b8d1"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
              <Text style={styles.balanceAmount}>{balanceDisplay}</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: expandedHeight,
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}>
        <Animated.View style={sheetLiftStyle}>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/add-money')}>
              <View style={styles.actionCircle}>
                <Ionicons name="add" size={32} color="#1a1a4e" />
              </View>
              <Text style={styles.actionLabel}>Depositar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/withdraw')}>
              <View style={styles.actionCircle}>
                <Ionicons name="cash-outline" size={28} color="#1a1a4e" />
              </View>
              <Text style={styles.actionLabel}>Levantar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/send-money/method')}>
              <View style={styles.actionCircle}>
                <Ionicons name="arrow-up-outline" size={28} color="#1a1a4e" />
              </View>
              <Text style={styles.actionLabel}>Transferência</Text>
            </TouchableOpacity>

            <View ref={moreButtonRef} collapsable={false} style={styles.actionButton}>
              <TouchableOpacity style={styles.actionButtonInner} onPress={openMoreMenu}>
                <View style={styles.actionCircle}>
                  <Ionicons name="ellipsis-horizontal" size={28} color="#1a1a4e" />
                </View>
                <Text style={styles.actionLabel}>Mais</Text>
              </TouchableOpacity>
            </View>
          </View>

          <HomeMoreMenu
            visible={moreMenuOpen}
            anchor={moreAnchor}
            onClose={() => setMoreMenuOpen(false)}
            onSelect={(item) => {
              if (item.id === 'movimentos') router.push('/movimentos');
              if (item.id === 'kixikila') router.push('/kixikila');
              if (item.id === 'seguros') {
                router.push({ pathname: '/payments/seguros', params: { from: 'home' } });
              }
              if (item.id === 'remessas') {
                router.push({ pathname: '/remessas', params: { from: 'home' } });
              }
            }}
          />

          <View style={styles.verificationCard}>
            <View style={styles.verificationContent}>
              <View style={styles.verificationIconContainer}>
                <Ionicons name="document-text" size={24} color="#1a1a4e" />
                <View style={styles.alertBadge}>
                  <Ionicons name="alert" size={12} color="#ffffff" />
                </View>
              </View>
              <View style={styles.verificationText}>
                <Text style={styles.verificationTitle}>Por favor verifique a sua conta</Text>
                <Text style={styles.verificationSubtitle}>
                  Faça a verificação para começar a utilizar todos o potencial da Kulex.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.verificationButton}
              onPress={() => router.push('/kyc')}>
              <Text style={styles.verificationButtonText}>Começar verificação</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Movimentos Recentes</Text>

            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons
                    name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={transaction.type === 'income' ? '#22c55e' : '#ef4444'}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: transaction.type === 'income' ? '#22c55e' : '#1a1a4e' },
                    ]}>
                    {transaction.amount}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroContent: {
    paddingBottom: 24,
  },
  profileWrap: {
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#1a1a5e',
  },
  searchBar: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchPlaceholder: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  bellBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  balanceSection: {
    alignItems: 'center',
  },
  balanceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabelText: {
    fontSize: 14,
    color: '#b8b8d1',
  },
  balanceAmount: {
    fontSize: 38,
    lineHeight: 46,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 28,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 28,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonInner: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  verificationCard: {
    backgroundColor: '#fafafa',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  verificationIconContainer: {
    position: 'relative',
    marginRight: 14,
  },
  alertBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationText: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a4e',
    marginBottom: 6,
  },
  verificationSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  verificationButton: {
    backgroundColor: '#12124a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  verificationButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsSection: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a4e',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a4e',
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
