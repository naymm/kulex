import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InicioIcon } from '@/components/tab-icons';
import { PAYMENT_CATEGORIES } from '@/constants/payments';

const NAVY = '#1A1A4E';

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  const [newPaymentOpen, setNewPaymentOpen] = useState(false);
  const sheetY = useRef(new Animated.Value(520)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [sheetMounted, setSheetMounted] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (newPaymentOpen) {
      setSheetMounted(true);
      sheetY.setValue(520);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(sheetY, {
          toValue: 0,
          duration: 190,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!sheetMounted) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetY, {
        toValue: 520,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setSheetMounted(false);
    });
  }, [newPaymentOpen, overlayOpacity, sheetMounted, sheetY]);

  const closeNewPayment = () => setNewPaymentOpen(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Pagamentos</Text>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => setNewPaymentOpen(true)}
          >
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
        showsVerticalScrollIndicator={false}
      >
        {PAYMENT_CATEGORIES.map((category, index) => (
          <PaymentCategoryRow
            key={category.id}
            category={category}
            last={index === PAYMENT_CATEGORIES.length - 1}
            onPress={() => {
              if (category.id === 'referencia') {
                router.push({ pathname: '/payments/referencia', params: { from: 'payments' } });
                return;
              }
              if (category.id === 'estado') {
                router.push({ pathname: '/payments/estado', params: { from: 'payments' } });
                return;
              }
              if (category.id === 'seguro') {
                router.push({ pathname: '/payments/seguros', params: { from: 'payments' } });
                return;
              }
              if (category.id === 'servicos') {
                router.push({ pathname: '/payments/servicos', params: { from: 'payments' } });
              }
            }}
          />
        ))}
      </ScrollView>

      <Modal
        visible={sheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeNewPayment}
      >
        <Animated.View
          pointerEvents={newPaymentOpen ? 'auto' : 'none'}
          style={[styles.modalOverlay, { opacity: overlayOpacity }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeNewPayment} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <Pressable
            style={styles.sheetClose}
            accessibilityRole="button"
            onPress={closeNewPayment}
          >
            <Ionicons name="close" size={18} color="#111827" />
          </Pressable>

          <Text style={styles.sheetTitle}>Novo Pagamento</Text>

          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Nome, @lextag, telefone, email"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              underlineColorAndroid="transparent"
            />
            <Ionicons name="qr-code-outline" size={18} color="#111827" />
          </View>

          <View style={styles.quickRow}>
            <QuickAction label="Kulex">
              <InicioIcon size={26} color="#111827" />
            </QuickAction>
            <QuickAction label="KWIK">
              <Text style={styles.kwik}>kwik</Text>
            </QuickAction>
            <QuickAction label="Banco">
              <Ionicons name="home-outline" size={22} color="#111827" />
            </QuickAction>
            <QuickAction label="Referência">
              <Ionicons name="flower-outline" size={22} color="#111827" />
            </QuickAction>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

function PaymentCategoryRow({
  category,
  last = false,
  onPress,
}: {
  category: (typeof PAYMENT_CATEGORIES)[number];
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={[styles.categoryRow, last && styles.categoryRowLast]}
      accessibilityRole="button"
      onPress={onPress}>
      <View style={styles.categoryLeft}>
        <View style={styles.categoryIconWrap}>
          <Ionicons name="cash-outline" size={18} color="#111827" />
        </View>
        <View style={styles.categoryText}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#111827" />
    </Pressable>
  );
}

function QuickAction({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.quickItem}>
      <Pressable style={styles.quickCircle} accessibilityRole="button">
        {children}
      </Pressable>
      <Text style={styles.quickLabel}>{label}</Text>
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
    minHeight: 40,
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
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  categoryDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryRowLast: {
    borderBottomWidth: 0,
  },
  modalOverlay: {
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
    paddingBottom: 24,
    minHeight: 560,
  },
  sheetClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  searchWrap: {
    marginTop: 18,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  quickItem: { alignItems: 'center', flex: 1 },
  quickCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  kwik: { fontSize: 14, fontWeight: '900', color: '#111827' },
});
