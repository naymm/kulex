import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KIXIKILA_ACTIONS,
  KIXIKILA_PROMO,
  getKixikilaStatusLabel,
  MY_KIXIKILAS,
  type KixikilaAction,
  type MyKixikila,
} from '@/constants/kixikila';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const HORIZONTAL_PADDING = 20;
const PROMO_CARD_IMAGE = require('../../assets/images/card-kixikila.png');

export default function KixikilaScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => goBackFromOrigin(from, () => router.dismissTo('/(tabs)'))}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Kixikila</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.promoCard}>
          <Image source={PROMO_CARD_IMAGE} style={styles.promoImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(26,26,78,0)', 'rgba(26,26,78,0.55)', 'rgba(26,26,78,0.92)']}
            locations={[0.35, 0.65, 1]}
            style={styles.promoGradient}
          />
          <View style={styles.promoTextWrap}>
            <Text style={styles.promoTitle}>{KIXIKILA_PROMO.title}</Text>
            <Text style={styles.promoSubtitle}>{KIXIKILA_PROMO.subtitle}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {KIXIKILA_ACTIONS.map((action) => (
            <ActionButton key={action.id} action={action} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Kixikilas</Text>
          <View style={styles.sectionDivider} />

          {MY_KIXIKILAS.map((item) => (
            <KixikilaListItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ActionButton({ action }: { action: KixikilaAction }) {
  const handlePress = () => {
    if (action.id === 'criar') {
      router.push('/kixikila/criar');
    }
    if (action.id === 'participar') {
      router.push('/kixikila/participar');
    }
  };

  return (
    <Pressable style={styles.actionItem} accessibilityRole="button" onPress={handlePress}>
      <View style={styles.actionCircle}>
        <Ionicons name={action.icon} size={26} color="#111827" />
      </View>
      <Text style={styles.actionLabel}>{action.label}</Text>
    </Pressable>
  );
}

function KixikilaListItem({ item }: { item: MyKixikila }) {
  const statusLabel = getKixikilaStatusLabel(item.status, item.members, item.memberCapacity);

  return (
    <Pressable
      style={styles.listRow}
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: '/kixikila/[id]',
          params: { id: item.id },
        })
      }>
      <View style={styles.listIcon}>
        <Text style={styles.listIconText}>K</Text>
      </View>
      <View style={styles.listText}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listMeta}>
          Membros: {item.members}/{item.memberCapacity} · {statusLabel}
        </Text>
        <Text style={styles.listMeta}>Montante: {item.amountPerMember}/membro</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
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
    paddingHorizontal: HORIZONTAL_PADDING,
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
    gap: 14,
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
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 24,
  },
  promoCard: {
    height: 176,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 28,
    backgroundColor: NAVY,
  },
  promoImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  promoGradient: {
    ...StyleSheet.absoluteFill,
  },
  promoTextWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 48,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  promoSubtitle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 17,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
  },
  actionCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  sectionDivider: {
    marginTop: 12,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIconText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  listText: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  listMeta: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 16,
  },
});
