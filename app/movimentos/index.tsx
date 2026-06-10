import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  filterMovements,
  MOVEMENTS,
  MOVEMENTS_INITIAL_COUNT,
  MOVEMENTS_LOAD_MORE_COUNT,
  type Movement,
  type MovementFilterType,
} from '@/constants/movimentos';
import { goBackFromOrigin } from '@/lib/navigation';
import {
  formatFilterDateLabel,
  formatIsoDate,
  parseIsoDate,
} from '@/lib/movimentos';

const NAVY = '#1A1A4E';

type FilterState = {
  type: MovementFilterType;
  dateFrom: string;
  dateTo: string;
};

const TYPE_OPTIONS: { id: MovementFilterType; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'debitos', label: 'Débitos' },
  { id: 'creditos', label: 'Créditos' },
];

type MovimentosFilterSheetProps = {
  visible: boolean;
  value: FilterState;
  onClose: () => void;
  onApply: (value: FilterState) => void;
};

type DateField = 'from' | 'to';

export function MovimentosFilterSheet({
  visible,
  value,
  onClose,
  onApply,
}: MovimentosFilterSheetProps) {
  const insets = useSafeAreaInsets();
  const sheetY = useRef(new Animated.Value(520)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState(value);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [activeDateField, setActiveDateField] = useState<DateField>('from');
  const [pickerDate, setPickerDate] = useState(new Date());

  useEffect(() => {
    if (!visible) {
      setDatePickerOpen(false);
    }
  }, [visible]);

  const openDatePicker = (field: DateField) => {
    const currentValue = field === 'from' ? draft.dateFrom : draft.dateTo;
    setActiveDateField(field);
    setPickerDate(parseIsoDate(currentValue));
    setDatePickerOpen(true);
  };

  const applyPickerDate = (date: Date) => {
    const iso = formatIsoDate(date);
    setDraft((prev) =>
      activeDateField === 'from'
        ? { ...prev, dateFrom: iso }
        : { ...prev, dateTo: iso },
    );
  };

  const onDatePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setDatePickerOpen(false);
      return;
    }

    if (selectedDate) {
      setPickerDate(selectedDate);
      applyPickerDate(selectedDate);
    }

    if (Platform.OS === 'android') {
      setDatePickerOpen(false);
    }
  };

  const clearDateField = (field: DateField) => {
    setDraft((prev) =>
      field === 'from' ? { ...prev, dateFrom: '' } : { ...prev, dateTo: '' },
    );
  };

  useEffect(() => {
    if (visible) {
      setDraft(value);
      setMounted(true);
      sheetY.setValue(520);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(sheetY, { toValue: 0, duration: 190, useNativeDriver: true }),
      ]).start();
      return;
    }

    if (!mounted) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 520, duration: 320, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, mounted, overlayOpacity, sheetY, value]);

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: sheetY }],
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}>
        <Pressable style={styles.close} accessibilityRole="button" onPress={onClose}>
          <Ionicons name="close" size={18} color="#111827" />
        </Pressable>

        <Text style={styles.title}>Filtrar por</Text>

        <Text style={styles.sectionLabel}>Tipo</Text>
        <View style={styles.typeRow}>
          {TYPE_OPTIONS.map((option) => {
            const selected = draft.type === option.id;
            return (
              <Pressable
                key={option.id}
                style={[styles.typeChip, selected && styles.typeChipSelected]}
                onPress={() => setDraft((prev) => ({ ...prev, type: option.id }))}>
                <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.dateList}>
          <Pressable
            style={styles.dateRow}
            accessibilityRole="button"
            onPress={() => openDatePicker('from')}>
            <Ionicons name="calendar-outline" size={18} color="#111827" />
            <Text style={styles.dateRowLabel}>De</Text>
            <Text
              style={[
                styles.dateRowValue,
                !draft.dateFrom && styles.dateRowPlaceholder,
              ]}>
              {formatFilterDateLabel(draft.dateFrom)}
            </Text>
            {draft.dateFrom ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpar data inicial"
                hitSlop={8}
                onPress={(event) => {
                  event.stopPropagation();
                  clearDateField('from');
                }}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            ) : (
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            )}
          </Pressable>

          <Pressable
            style={styles.dateRow}
            accessibilityRole="button"
            onPress={() => openDatePicker('to')}>
            <Ionicons name="calendar-outline" size={18} color="#111827" />
            <Text style={styles.dateRowLabel}>Até</Text>
            <Text
              style={[
                styles.dateRowValue,
                !draft.dateTo && styles.dateRowPlaceholder,
              ]}>
              {formatFilterDateLabel(draft.dateTo)}
            </Text>
            {draft.dateTo ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpar data final"
                hitSlop={8}
                onPress={(event) => {
                  event.stopPropagation();
                  clearDateField('to');
                }}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            ) : (
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            )}
          </Pressable>
        </View>

        {datePickerOpen && Platform.OS === 'android' ? (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="default"
            onChange={onDatePickerChange}
          />
        ) : null}

        <Pressable
          style={styles.applyButton}
          accessibilityRole="button"
          onPress={() => {
            onApply(draft);
            onClose();
          }}>
          <Text style={styles.applyButtonText}>Aplicar</Text>
        </Pressable>
      </Animated.View>

      <Modal
        visible={datePickerOpen && Platform.OS === 'ios'}
        transparent
        animationType="slide"
        onRequestClose={() => setDatePickerOpen(false)}>
        <Pressable style={styles.datePickerOverlay} onPress={() => setDatePickerOpen(false)} />
        <View style={[styles.datePickerSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.datePickerTitle}>
            {activeDateField === 'from' ? 'Data inicial' : 'Data final'}
          </Text>
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="spinner"
            onChange={onDatePickerChange}
            locale="pt-PT"
            style={styles.datePicker}
          />
          <Pressable
            style={styles.datePickerConfirm}
            accessibilityRole="button"
            onPress={() => setDatePickerOpen(false)}>
            <Text style={styles.datePickerConfirmText}>Confirmar</Text>
          </Pressable>
        </View>
      </Modal>
    </Modal>
  );
}

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

export default function MovimentosScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({
    type: 'todos',
    dateFrom: '',
    dateTo: '',
  });
  const [visibleCount, setVisibleCount] = useState(MOVEMENTS_INITIAL_COUNT);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredMovements = useMemo(
    () => filterMovements(MOVEMENTS, filter.type, filter.dateFrom, filter.dateTo),
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
            onPress={() => goBackFromOrigin(from)}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Movimentos</Text>
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
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  sectionLabel: {
    marginTop: 22,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  typeChip: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeChipSelected: {
    backgroundColor: '#E5E7EB',
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  typeChipTextSelected: {
    color: '#111827',
    fontWeight: '700',
  },
  dateList: {
    marginTop: 12,
    gap: 10,
  },
  dateRow: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateRowLabel: {
    width: 32,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  dateRowValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dateRowPlaceholder: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  datePickerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  datePicker: {
    alignSelf: 'center',
  },
  datePickerConfirm: {
    marginTop: 8,
    height: 48,
    borderRadius: 24,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  applyButton: {
    marginTop: 28,
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
