import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCollapsibleHomeHeader } from '@/hooks/useCollapsibleHomeHeader';
import { HomeMoreMenu, type HomeMoreMenuItem } from '@/components/home/HomeMoreMenu';
import {
  AccountAvatar,
  AccountSwitcherSheet,
} from '@/components/menu/AccountSwitcherSheet';
import {
  AGENT_COMMISSION_BALANCE,
  AGENT_HISTORY,
  AGENT_OPERATION_ACTIONS,
  AGENT_OPERATION_TYPE_ICONS,
  AGENT_OPERATION_TYPE_LABELS,
  AGENT_REWARDS,
} from '@/constants/agent';
import { useActiveAccount } from '@/contexts/AccountContext';
import { getUnreadNotificationCount } from '@/lib/agent';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';
const HERO_HEIGHT = 108;
const HERO_CAROUSEL_HEIGHT = 72;

const AGENT_MORE_MENU_ITEMS: HomeMoreMenuItem[] = [
  { id: 'historico', label: 'Histórico', icon: 'time-outline' },
  { id: 'comissoes', label: 'Transferir comissões', icon: 'swap-horizontal' },
  { id: 'recompensas', label: 'Recompensas', icon: 'trophy-outline' },
];

export function AgentHomeScreen() {
  const insets = useSafeAreaInsets();
  const { accounts, activeAccount, activeAccountId, switchAccount } = useActiveAccount();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(getUnreadNotificationCount());
  const [showBalance, setShowBalance] = useState(true);
  const [showCommissions, setShowCommissions] = useState(true);
  const [heroPage, setHeroPage] = useState(0);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [moreAnchor, setMoreAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const moreButtonRef = useRef<View>(null);
  const { width: screenWidth } = useWindowDimensions();
  const heroPageWidth = screenWidth - 40;
  const balanceDisplay = showBalance ? activeAccount.balance : '•••••••• kz';
  const commissionsDisplay = showCommissions ? AGENT_COMMISSION_BALANCE : '•••••••• kz';

  const {
    scrollHandler,
    headerStyle,
    headerPaddingStyle,
    toolbarStyle,
    heroContentStyle,
    sheetLiftStyle,
    headerBorderStyle,
    expandedHeight,
  } = useCollapsibleHomeHeader(insets, HERO_HEIGHT);

  useFocusEffect(
    useCallback(() => {
      setUnreadCount(getUnreadNotificationCount());
    }, []),
  );

  const recentHistory = AGENT_HISTORY.slice(0, 3);

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
            <Pressable
              style={styles.profileWrap}
              accessibilityRole="button"
              accessibilityLabel="Trocar conta"
              onPress={() => setSwitcherOpen(true)}>
              <AccountAvatar account={activeAccount} size={48} />
              <View style={styles.accountBadge}>
                <Text style={styles.accountBadgeText}>AG</Text>
              </View>
            </Pressable>

            <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
              <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.55)" />
              <Text style={styles.searchPlaceholder}>Pesquisar cliente</Text>
            </TouchableOpacity>

            <Pressable
              style={styles.bellBtn}
              accessibilityRole="button"
              onPress={() => router.push('/agent/notificacoes')}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              {unreadCount > 0 ? (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.heroContent, heroContentStyle]}>
            <ScrollView
              horizontal
              pagingEnabled
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              style={{ height: HERO_CAROUSEL_HEIGHT }}
              onMomentumScrollEnd={(event) => {
                const page = Math.round(event.nativeEvent.contentOffset.x / heroPageWidth);
                setHeroPage(page);
              }}>
              <View style={[styles.heroPage, { width: heroPageWidth }]}>
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
              </View>

              <View style={[styles.heroPage, { width: heroPageWidth }]}>
                <View style={styles.balanceSection}>
                  <TouchableOpacity
                    style={styles.balanceLabel}
                    onPress={() => setShowCommissions(!showCommissions)}
                    activeOpacity={0.7}>
                    <Text style={styles.balanceLabelText}>Comissões</Text>
                    <Ionicons
                      name={showCommissions ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#b8b8d1"
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.balanceAmount}>{commissionsDisplay}</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.heroPager}>
              <View style={[styles.heroDot, heroPage === 0 && styles.heroDotActive]} />
              <View style={[styles.heroDot, heroPage === 1 && styles.heroDotActive]} />
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scroll}
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
                <Ionicons name="add" size={32} color={NAVY} />
              </View>
              <Text style={styles.actionLabel}>Depositar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/withdraw')}>
              <View style={styles.actionCircle}>
                <Ionicons name="cash-outline" size={28} color={NAVY} />
              </View>
              <Text style={styles.actionLabel}>Levantar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                router.push({
                  pathname: '/send-money/method',
                  params: { from: 'agent' },
                })
              }>
              <View style={styles.actionCircle}>
                <Ionicons name="arrow-up-outline" size={28} color={NAVY} />
              </View>
              <Text style={styles.actionLabel}>Transferência</Text>
            </TouchableOpacity>

            <View ref={moreButtonRef} collapsable={false} style={styles.actionButton}>
              <TouchableOpacity style={styles.actionButtonInner} onPress={openMoreMenu}>
                <View style={styles.actionCircle}>
                  <Ionicons name="ellipsis-horizontal" size={28} color={NAVY} />
                </View>
                <Text style={styles.actionLabel}>Mais</Text>
              </TouchableOpacity>
            </View>
          </View>

          <HomeMoreMenu
            visible={moreMenuOpen}
            anchor={moreAnchor}
            items={AGENT_MORE_MENU_ITEMS}
            onClose={() => setMoreMenuOpen(false)}
            onSelect={(item) => {
              if (item.id === 'operar') router.push('/(tabs)/agent-operar');
              if (item.id === 'historico') router.push('/agent/historico');
              if (item.id === 'comissoes') router.push('/agent/transferir');
              if (item.id === 'recompensas') router.push('/agent/recompensas');
            }}
          />

          <View style={styles.operationsCard}>
            <Text style={styles.sectionTitle}>Operações com clientes</Text>
            <View style={styles.operationsGrid}>
              {AGENT_OPERATION_ACTIONS.map((action) => (
                <Pressable
                  key={action.id}
                  style={styles.operationTile}
                  accessibilityRole="button"
                  onPress={() => router.push(action.href as never)}>
                  <View style={[styles.operationIcon, { backgroundColor: action.iconBg }]}>
                    <Ionicons name={action.icon} size={24} color={action.iconColor} />
                  </View>
                  <Text style={styles.operationTitle}>{action.title}</Text>
                  <Text style={styles.operationSubtitle}>{action.subtitle}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.linksCard}>
            <Pressable
              style={styles.linkRow}
              accessibilityRole="button"
              onPress={() => router.push('/agent/historico')}>
              <View style={styles.linkIconWrap}>
                <Ionicons name="time-outline" size={22} color={NAVY} />
              </View>
              <View style={styles.linkText}>
                <Text style={styles.linkTitle}>Histórico detalhado</Text>
                <Text style={styles.linkSubtitle}>
                  Abertura de conta, cash-in, cash-out e cartões
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            <View style={styles.linkDivider} />

            <Pressable
              style={styles.linkRow}
              accessibilityRole="button"
              onPress={() => router.push('/agent/transferir')}>
              <View style={[styles.linkIconWrap, styles.linkIconGold]}>
                <Ionicons name="swap-horizontal-outline" size={22} color={GOLD} />
              </View>
              <View style={styles.linkText}>
                <Text style={styles.linkTitle}>Transferir comissões</Text>
                <Text style={styles.linkSubtitle}>Para a conta pessoal</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          <Pressable
            style={styles.rewardsCard}
            accessibilityRole="button"
            onPress={() => router.push('/agent/recompensas')}>
            <LinearGradient
              colors={['#2A2A6E', '#1A1A4E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.rewardsGradient}
            />
            <View style={styles.rewardsContent}>
              <View>
                <Text style={styles.rewardsEyebrow}>KULEX Recompensas</Text>
                <Text style={styles.rewardsTitle}>
                  {AGENT_REWARDS.points.toLocaleString('pt-PT')} pontos · Nível{' '}
                  {AGENT_REWARDS.levels.find((l) => l.id === AGENT_REWARDS.levelId)?.name}
                </Text>
                <Text style={styles.rewardsSubtitle}>
                  Ganhe pontos em cada operação com clientes
                </Text>
              </View>
              <Ionicons name="trophy-outline" size={32} color={GOLD} />
            </View>
          </Pressable>

          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitleDark}>Actividade recente</Text>
              <Pressable accessibilityRole="button" onPress={() => router.push('/agent/historico')}>
                <Text style={styles.seeAll}>Ver tudo</Text>
              </Pressable>
            </View>

            {recentHistory.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <View style={styles.historyIcon}>
                  <Ionicons
                    name={AGENT_OPERATION_TYPE_ICONS[item.type]}
                    size={20}
                    color={NAVY}
                  />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>
                    {AGENT_OPERATION_TYPE_LABELS[item.type]} · {item.clientName}
                  </Text>
                  <Text style={styles.historyMeta}>
                    {item.dateLabel} · {item.timeLabel}
                  </Text>
                </View>
                <Text style={styles.historyCommission}>{item.commission}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>

      <AccountSwitcherSheet
        visible={switcherOpen}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onClose={() => setSwitcherOpen(false)}
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
    gap: 12,
  },
  heroContent: {
    paddingBottom: 8,
  },
  heroPage: {
    justifyContent: 'flex-start',
  },
  balanceSection: {
    alignItems: 'center',
    paddingTop: 2,
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
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroPager: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  heroDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 10,
  },
  heroDotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
  profileWrap: {
    position: 'relative',
  },
  accountBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    backgroundColor: GOLD,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#1a1a5e',
  },
  accountBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
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
  scroll: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
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
  operationsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 14,
  },
  operationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  operationTile: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  operationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  operationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  operationSubtitle: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  linksCard: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    display: 'none',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  linkIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkIconGold: {
    backgroundColor: '#FFFBEB',
  },
  linkText: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  linkSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  linkDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  rewardsCard: {
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: 'hidden',
  },
  rewardsGradient: {
    ...StyleSheet.absoluteFill,
  },
  rewardsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  rewardsEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  rewardsTitle: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rewardsSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
  },
  recentSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleDark: {
    fontSize: 18,
    fontWeight: '800',
    color: NAVY,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  historyMeta: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  historyCommission: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
});
