import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALL_CARD_MOVEMENTS } from '@/constants/card-movements';
import {
  filterMovements,
  MOVEMENTS_INITIAL_COUNT,
  MOVEMENTS_LOAD_MORE_COUNT,
  type Movement,
  type MovementFilterType,
} from '@/constants/movimentos';
import { MovimentosFilterSheet } from '@/app/movimentos/index';

const NAVY = '#1A1A4E';

type FilterState = {
  type: MovementFilterType;
  dateFrom: string;
  dateTo: string;
};

function MovementRow({ item, onPress }: { item: Movement; onPress: () => void }) {
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

export default function CardMovimentosScreen() {
  const insets = useSafeAreaInsets();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({
    type: 'todos',
    dateFrom: '',
    dateTo: '',
  });
  const [visibleCount, setVisibleCount] = useState(MOVEMENTS_INITIAL_COUNT);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredMovements = useMemo(
    () => filterMovements(ALL_CARD_MOVEMENTS, filter.type, filter.dateFrom, filter.dateTo),
    [filter]
  );

  const visibleMovements = useMemo(
    () => filteredMovements.slice(0, visibleCount),
    [filteredMovements, visibleCount]
  );

  const hasMore = visibleCount < filteredMovements.length;

  useEffect(() => {
    setVisibleCount(MOVEMENTS_INITIAL_COUNT);
  }, [filter]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + MOVEMENTS_LOAD_MORE_COUNT, filteredMovements.length)
      );
      setLoadingMore(false);
    }, 400);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - (layoutMeasurement.height + contentOffset.y);
    if (distanceFromBottom < 120) {
      loadMore();
    }
  };

  const handleApplyFilter = (value: FilterState) => {
    setFilter(value);
    setVisibleCount(MOVEMENTS_INITIAL_COUNT);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Todas as Transações</Text>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => setFilterOpen(true)}>
            <Ionicons name="options-outline" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        data={visibleMovements}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={loadMore}
        onEndReachedThreshold={0.25}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Movimentos Recentes</Text>}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator color={NAVY} />
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.listCardRow,
              index === 0 && styles.listCardRowFirst,
              index === visibleMovements.length - 1 && styles.listCardRowLast,
            ]}>
            <MovementRow
              item={item}
              onPress={() =>
                router.push({
                  pathname: '/movimentos/[id]',
                  params: { id: item.id },
                })
              }
            />
            {index < visibleMovements.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        )}
      />

      <MovimentosFilterSheet
        visible={filterOpen}
        value={filter}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilter}
      />
    </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
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
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
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
