import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardMoreSheet, type CardMoreMenuItem } from '@/components/cards/CardMoreSheet';
import { CardWalletCarousel } from '@/components/cards/CardWalletCarousel';
import { IncreasePlafondSheet } from '@/components/cards/IncreasePlafondSheet';
import { CARD_MOVEMENTS } from '@/constants/card-movements';
import { POSTPAID_BLACK_CARD, WALLET_CARDS } from '@/constants/card';
import type { Movement } from '@/constants/movimentos';
import { buildPostpaidBillSummary } from '@/lib/postpaid-bill';
import { applyPlafondIncrease, isPlafondAtMaximum } from '@/lib/postpaid-plafond';
import {
  getPostpaidWalletState,
  setPostpaidWalletState,
  type PostpaidWalletState,
} from '@/lib/postpaid-wallet';

const NAVY = '#1A1A4E';

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [increasePlafondOpen, setIncreasePlafondOpen] = useState(false);
  const [postpaidWallet, setPostpaidWallet] = useState<PostpaidWalletState>(getPostpaidWalletState);

  const activeCard = WALLET_CARDS[activeCardIndex];
  const isPrepaid = activeCard?.kind === 'prepaid';
  const isPostpaid = activeCard?.kind === 'postpaid';

  const postpaidMeta = useMemo(() => {
    if (!isPostpaid || activeCard.kind !== 'postpaid') return null;
    return {
      ...activeCard,
      plafond: postpaidWallet.plafond,
      available: postpaidWallet.available,
    };
  }, [activeCard, isPostpaid, postpaidWallet]);

  const plafondAtMaximum = useMemo(() => {
    if (!postpaidMeta) return false;
    return isPlafondAtMaximum(postpaidMeta.tierId, postpaidMeta.plafond);
  }, [postpaidMeta]);

  const postpaidBill = useMemo(() => {
    if (!postpaidMeta) return null;
    return buildPostpaidBillSummary(postpaidMeta.plafond, postpaidMeta.available);
  }, [postpaidMeta]);

  const handleIncreasePlafond = (newPlafond: string) => {
    if (!postpaidMeta) return;

    const updated = applyPlafondIncrease(
      postpaidWallet.plafond,
      postpaidWallet.available,
      newPlafond,
    );

    setPostpaidWallet(updated);
    setPostpaidWalletState(updated);
  };

  const handleMoreSelect = (item: CardMoreMenuItem) => {
    if (item.id === 'saque') {
      router.push('/cards/saque');
      return;
    }
    if (item.id === 'extracto') {
      router.push('/cards/movimentos');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Meus Cartões</Text>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel="Adicionar cartão"
            onPress={() => router.push('/cards/adicionar')}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 12) + 70 },
        ]}
        showsVerticalScrollIndicator={false}>
        <CardWalletCarousel
          cards={WALLET_CARDS}
          activeIndex={activeCardIndex}
          onActiveIndexChange={setActiveCardIndex}
          isFrozen={isPrepaid && isFrozen}
        />

        {postpaidMeta && postpaidBill ? (
          <>
            <View style={styles.postpaidMeta}>
              <View style={styles.postpaidMetaItem}>
                <Text style={styles.postpaidMetaLabel}>Plafond</Text>
                <Text style={styles.postpaidMetaValue}>AOA {postpaidMeta.plafond}</Text>
              </View>
              <View style={styles.postpaidMetaDivider} />
              <View style={styles.postpaidMetaItem}>
                <Text style={styles.postpaidMetaLabel}>Utilizado</Text>
                <Text style={styles.postpaidMetaValue}>AOA {postpaidBill.usedAmount}</Text>
              </View>
              <View style={styles.postpaidMetaDivider} />
              <View style={styles.postpaidMetaItem}>
                <Text style={styles.postpaidMetaLabel}>Disponível</Text>
                <Text style={styles.postpaidMetaValue}>AOA {postpaidMeta.available}</Text>
              </View>
            </View>

            <Pressable
              style={styles.plafondNote}
              accessibilityRole="button"
              onPress={() => setIncreasePlafondOpen(true)}>
              <Ionicons name="information-circle-outline" size={16} color="#C9A227" />
              <Text style={styles.plafondNoteText}>
                {plafondAtMaximum
                  ? 'Plafond máximo atingido para este cartão.'
                  : 'Plafond mínimo activo. Pode solicitar aumento dentro do intervalo do cartão.'}
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
            </Pressable>

            <Pressable
              style={styles.billCard}
              accessibilityRole="button"
              disabled={!postpaidBill.hasDebt}
              onPress={() => router.push('/cards/fatura')}>
              <View style={styles.billCardHeader}>
                <Text style={styles.billCardEyebrow}>Fatura · {POSTPAID_BLACK_CARD.bill.periodLabel}</Text>
                <Text style={styles.billCardDue}>
                  Vence {POSTPAID_BLACK_CARD.bill.dueDateLabel}
                </Text>
              </View>
              <View style={styles.billCardBody}>
                <View>
                  <Text style={styles.billCardLabel}>Valor a pagar</Text>
                  <Text style={styles.billCardAmount}>AOA {postpaidBill.usedAmount}</Text>
                </View>
                <View style={[styles.billCardBtn, !postpaidBill.hasDebt && styles.billCardBtnDisabled]}>
                  <Text style={styles.billCardBtnText}>Pagar fatura</Text>
                  <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </View>
              </View>
            </Pressable>
          </>
        ) : null}

        <View style={styles.actionsRow}>
          <ActionButton
            icon="card-outline"
            label="Detalhes"
            primary={isPrepaid}
            onPress={() => router.push('/cards/detalhes')}
          />
          {isPrepaid ? (
            <>
              <ActionButton
                icon="add"
                label="Carregar"
                disabled={isFrozen}
                onPress={() => router.push('/cards/carregar')}
              />
              <ActionButton
                icon={isFrozen ? 'sunny-outline' : 'snow-outline'}
                label={isFrozen ? 'Descongelar' : 'Congelar'}
                active={isFrozen}
                onPress={() => setIsFrozen((v) => !v)}
              />
              <ActionButton
                icon="ellipsis-horizontal"
                label="Mais"
                disabled={isFrozen}
                onPress={() => setMoreMenuOpen(true)}
              />
            </>
          ) : (
            <>
              <ActionButton
                icon="receipt-outline"
                label="Pagar fatura"
                primary
                disabled={!postpaidBill?.hasDebt}
                onPress={() => router.push('/cards/fatura')}
              />
              <ActionButton
                icon="list-outline"
                label="Movimentos"
                onPress={() => router.push('/cards/movimentos')}
              />
              <ActionButton
                icon="trending-up-outline"
                label="Aumentar plafond"
                disabled={plafondAtMaximum}
                onPress={() => setIncreasePlafondOpen(true)}
              />
            </>
          )}
        </View>

        {!isPostpaid ? (
        <Pressable
          style={styles.postpaidPromo}
          accessibilityRole="button"
          onPress={() => router.push('/cards/pos-pago')}>
          <View style={styles.postpaidIcon}>
            <Ionicons name="card" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.postpaidText}>
            <Text style={styles.postpaidTitle}>Mastercard Pós-pago</Text>
            <Text style={styles.postpaidSubtitle}>
              Solicite crédito rotativo com verificação de scoring e plafond personalizado.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C9A227" />
        </Pressable>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Histórico de Transações</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/cards/movimentos')}>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </Pressable>
        </View>
        <View style={styles.movementsCard}>
          {CARD_MOVEMENTS.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.listCardRow,
                index === 0 && styles.listCardRowFirst,
                index === CARD_MOVEMENTS.length - 1 && styles.listCardRowLast,
              ]}>
              <CardMovementRow
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/movimentos/[id]',
                    params: { id: item.id },
                  })
                }
              />
              {index < CARD_MOVEMENTS.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>

      <CardMoreSheet
        visible={moreMenuOpen}
        onClose={() => setMoreMenuOpen(false)}
        onSelect={handleMoreSelect}
      />

      {postpaidMeta ? (
        <IncreasePlafondSheet
          visible={increasePlafondOpen}
          tierId={postpaidMeta.tierId}
          currentPlafond={postpaidMeta.plafond}
          onClose={() => setIncreasePlafondOpen(false)}
          onConfirm={handleIncreasePlafond}
        />
      ) : null}
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  primary = false,
  active = false,
  disabled = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  primary?: boolean;
  active?: boolean;
  disabled?: boolean;
}) {
  const iconColor = disabled
    ? primary
      ? 'rgba(255,255,255,0.45)'
      : '#9CA3AF'
    : primary
      ? '#FFFFFF'
      : '#111827';

  return (
    <View style={styles.action}>
      <Pressable
        style={[
          styles.actionCircle,
          primary ? styles.actionCirclePrimary : styles.actionCircleSecondary,
          active && (primary ? styles.actionCirclePrimaryActive : styles.actionCircleSecondaryActive),
          disabled && styles.actionCircleDisabled,
        ]}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}>
        <Ionicons name={icon} size={26} color={iconColor} />
      </Pressable>
      <Text style={[styles.actionLabel, disabled && styles.actionLabelDisabled]}>{label}</Text>
    </View>
  );
}

function CardMovementRow({ item, onPress }: { item: Movement; onPress: () => void }) {
  const isCredit = item.type === 'credit';

  return (
    <Pressable style={styles.movementRow} accessibilityRole="button" onPress={onPress}>
      <View style={styles.movementIcon}>
        <Ionicons
          name={isCredit ? 'arrow-down' : 'arrow-up'}
          size={18}
          color="#111827"
        />
      </View>
      <View style={styles.movementInfo}>
        <Text style={styles.movementTitle}>{item.title}</Text>
        <Text style={styles.movementDate}>{item.dateLabel}</Text>
      </View>
      <Text style={styles.movementAmount}>{item.amount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  headerBtn: {
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  postpaidMeta: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  postpaidMetaItem: {
    flex: 1,
    alignItems: 'center',
  },
  postpaidMetaDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: '#E5E7EB',
  },
  postpaidMetaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  postpaidMetaValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '800',
    color: NAVY,
  },
  plafondNote: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E8C4',
    backgroundColor: '#FFFBEB',
  },
  plafondNoteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 16,
  },
  billCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  billCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  billCardEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: NAVY,
  },
  billCardDue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  billCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  billCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  billCardAmount: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  billCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: NAVY,
  },
  billCardBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  billCardBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
    paddingHorizontal: 8,
  },
  action: {
    alignItems: 'center',
    flex: 1,
  },
  actionCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCirclePrimary: {
    backgroundColor: NAVY,
  },
  actionCirclePrimaryActive: {
    backgroundColor: '#4B5563',
  },
  actionCircleSecondary: {
    backgroundColor: '#E5E7EB',
  },
  actionCircleSecondaryActive: {
    backgroundColor: '#D1D5DB',
  },
  actionCircleDisabled: {
    backgroundColor: '#F3F4F6',
  },
  actionLabel: {
    marginTop: 10,
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  actionLabelDisabled: {
    color: '#9CA3AF',
  },
  postpaidPromo: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  postpaidIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postpaidText: {
    flex: 1,
  },
  postpaidTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  postpaidSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 16,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
  movementsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  listCardRow: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  listCardRowFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  listCardRowLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 4,
  },
  movementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  movementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  movementInfo: {
    flex: 1,
    paddingRight: 12,
  },
  movementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  movementDate: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  movementAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
});
