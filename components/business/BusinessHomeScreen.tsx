import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AccountAvatar,
  AccountSwitcherSheet,
} from '@/components/menu/AccountSwitcherSheet';
import {
  BUSINESS_MONTHLY_SUMMARY,
  BUSINESS_PROFILE,
  BUSINESS_QUICK_ACTIONS,
  BUSINESS_RECENT_TRANSACTIONS,
} from '@/constants/business';
import { useActiveAccount } from '@/contexts/AccountContext';
import { getUnreadBusinessNotificationCount } from '@/lib/business';
import { useCollapsibleHomeHeader } from '@/hooks/useCollapsibleHomeHeader';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';
const HERO_HEIGHT = 130;

export function BusinessHomeScreen() {
  const insets = useSafeAreaInsets();
  const { accounts, activeAccount, activeAccountId, switchAccount } = useActiveAccount();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [unreadCount, setUnreadCount] = useState(getUnreadBusinessNotificationCount());

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

  const balanceDisplay = showBalance ? activeAccount.balance : '•••••••• kz';

  useFocusEffect(
    useCallback(() => {
      setUnreadCount(getUnreadBusinessNotificationCount());
    }, []),
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle, headerBorderStyle]}>
        <Animated.View style={[styles.headerGradient, headerPaddingStyle]}>
          <LinearGradient
            colors={['#12124a', '#1a1a5e', '#252570']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Animated.View style={[styles.headerTop, toolbarStyle]}>
            <Pressable
              style={styles.profileWrap}
              accessibilityRole="button"
              accessibilityLabel="Trocar conta"
              onPress={() => setSwitcherOpen(true)}>
              <AccountAvatar account={activeAccount} size={48} />
              <View style={styles.accountBadge}>
                <Text style={styles.accountBadgeText}>BZ</Text>
              </View>
            </Pressable>

            <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
              <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.55)" />
              <Text style={styles.searchPlaceholder}>Pesquisar na loja</Text>
            </TouchableOpacity>

            <Pressable
              style={styles.bellBtn}
              accessibilityRole="button"
              onPress={() => router.push('/business/notificacoes')}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              {unreadCount > 0 ? (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.heroContent, heroContentStyle]}>
            <TouchableOpacity
              style={styles.balanceLabel}
              onPress={() => setShowBalance(!showBalance)}
              activeOpacity={0.7}>
              <Text style={styles.balanceLabelText}>Saldo da loja</Text>
              <Ionicons
                name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#b8b8d1"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            <Text style={styles.balanceAmount}>{balanceDisplay}</Text>

            <View style={styles.companyRow}>
              <Text style={styles.companyName}>{BUSINESS_PROFILE.tradeName}</Text>
              <Text style={styles.companyMeta}>
                {BUSINESS_PROFILE.location} · NIF {BUSINESS_PROFILE.nif}
              </Text>
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
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>
              Recebido em {BUSINESS_MONTHLY_SUMMARY.monthLabel}
            </Text>
            <Text style={styles.summaryValue}>{BUSINESS_MONTHLY_SUMMARY.totalReceived}</Text>
            <Text style={styles.summaryMeta}>
              {BUSINESS_MONTHLY_SUMMARY.transactionCount} transacções
            </Text>
          </View>

          <View style={styles.quickGrid}>
            {BUSINESS_QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={styles.quickTile}
                accessibilityRole="button"
                onPress={() => router.push(action.href as never)}>
                <View style={[styles.quickIcon, { backgroundColor: action.iconBg }]}>
                  <Ionicons name={action.icon} size={24} color={action.iconColor} />
                </View>
                <Text style={styles.quickTitle}>{action.title}</Text>
                <Text style={styles.quickSubtitle}>{action.subtitle}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.creditCard}
            accessibilityRole="button"
            onPress={() => router.push('/business/credito-stock')}>
            <LinearGradient
              colors={['#1A1A4E', '#2A2A6E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.creditContent}>
              <View>
                <Text style={styles.creditEyebrow}>Crédito de stock</Text>
                <Text style={styles.creditTitle}>Pré-aprovado até 2.000.000,00 kz</Text>
                <Text style={styles.creditMeta}>TAN 24% a.a. · Prazo 60 dias</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
            </View>
          </Pressable>

          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Movimentos recentes</Text>
              <Pressable onPress={() => router.push('/business/relatorios/extracto')}>
                <Text style={styles.seeAll}>Ver extracto</Text>
              </Pressable>
            </View>
            {BUSINESS_RECENT_TRANSACTIONS.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txIcon}>
                  <Ionicons
                    name={tx.type === 'income' ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={tx.type === 'income' ? '#22c55e' : '#ef4444'}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txDesc}>{tx.description}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'income' ? '#22c55e' : NAVY },
                    ]}>
                    {tx.amount}
                  </Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
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
  container: { flex: 1, backgroundColor: '#F3F4F6' },
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
  headerGradient: { flex: 1, paddingHorizontal: 20, overflow: 'hidden' },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroContent: { paddingBottom: 16, alignItems: 'center' },
  profileWrap: { position: 'relative' },
  accountBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#1a1a5e',
  },
  accountBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
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
  searchPlaceholder: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.55)' },
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
  bellBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  balanceLabel: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  balanceLabelText: { fontSize: 14, color: '#b8b8d1' },
  balanceAmount: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  companyRow: { marginTop: 10, alignItems: 'center' },
  companyName: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  companyMeta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  scroll: { flex: 1 },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 20,
  },
  summaryLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  summaryValue: { marginTop: 6, fontSize: 24, fontWeight: '800', color: TEAL },
  summaryMeta: { marginTop: 4, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickTile: { width: '47%' },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickTitle: { fontSize: 14, fontWeight: '800', color: NAVY },
  quickSubtitle: { marginTop: 3, fontSize: 12, fontWeight: '500', color: '#6B7280' },
  creditCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    overflow: 'hidden',
    minHeight: 100,
  },
  creditContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  creditEyebrow: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.65)' },
  creditTitle: { marginTop: 4, fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  creditMeta: { marginTop: 6, fontSize: 12, fontWeight: '500', color: TEAL },
  transactionsSection: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: NAVY },
  seeAll: { fontSize: 13, fontWeight: '600', color: TEAL },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 15, fontWeight: '600', color: NAVY },
  txDesc: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontWeight: '700' },
  txDate: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
});
