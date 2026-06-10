import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CREDIT_PRODUCTS,
  CREDIT_PROMO,
  CREDIT_SIMULATOR_PRODUCTS,
  type CreditProduct,
} from '@/constants/credit';
import { CreditSelectField } from '@/components/credit/CreditSelectField';
import { CreditTextField } from '@/components/credit/CreditTextField';

const NAVY = '#1A1A4E';
const NUM_COLUMNS = 4;
const HORIZONTAL_PADDING = 20;
const GRID_GAP = 14;
const PROMO_CARD_IMAGE = require('../../assets/images/card-dinheiro.png');

export default function CreditoScreen() {
  const insets = useSafeAreaInsets();
  const tileSize = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    return (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
  }, []);
  const [tab, setTab] = useState<'produtos' | 'simulador'>('produtos');
  const [selectedProduct, setSelectedProduct] = useState('Maka Zero');
  const [amountDigits, setAmountDigits] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const sheetTranslateY = useRef(new Animated.Value(420)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [sheetMounted, setSheetMounted] = useState(false);
  const [simModalOpen, setSimModalOpen] = useState(false);
  const simSheetTranslateY = useRef(new Animated.Value(520)).current;
  const simOverlayOpacity = useRef(new Animated.Value(0)).current;
  const [simSheetMounted, setSimSheetMounted] = useState(false);

  const products = useMemo(() => CREDIT_SIMULATOR_PRODUCTS, []);
  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits]
  );

  const openProduct = (product: CreditProduct) => {
    router.push({
      pathname: '/credito-flow/[product]',
      params: { product: product.id },
    });
  };

  useEffect(() => {
    if (productModalOpen) {
      setSheetMounted(true);
      sheetTranslateY.setValue(420);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 280,
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
      Animated.timing(sheetTranslateY, {
        toValue: 420,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setSheetMounted(false);
    });
  }, [productModalOpen, sheetMounted, sheetTranslateY]);

  const closeProductModal = () => setProductModalOpen(false);

  useEffect(() => {
    if (simModalOpen) {
      setSimSheetMounted(true);
      simSheetTranslateY.setValue(520);
      simOverlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(simOverlayOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(simSheetTranslateY, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!simSheetMounted) return;
    Animated.parallel([
      Animated.timing(simOverlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(simSheetTranslateY, {
        toValue: 520,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setSimSheetMounted(false);
    });
  }, [simModalOpen, simSheetMounted, simSheetTranslateY, simOverlayOpacity]);

  const closeSimModal = () => setSimModalOpen(false);

  const simAmount = useMemo(() => {
    if (!amountDigits) return '50.000,00 kz';
    const cents = Number(amountDigits);
    if (!Number.isFinite(cents)) return '50.000,00 kz';
    return `${(cents / 100).toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} kz`;
  }, [amountDigits]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Crédito</Text>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerAction}
              accessibilityRole="button"
              onPress={() => router.push('/scoring')}
            >
              <Text style={styles.headerActionText}>Scoring</Text>
            </Pressable>
            <Pressable
              style={styles.headerAction}
              accessibilityRole="button"
              onPress={() => router.push('/credito-flow/meus-creditos')}
            >
              <Text style={styles.headerActionText}>Meus Créditos</Text>
            </Pressable>
          </View>
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
        <View style={styles.promoCard}>
          <Image source={PROMO_CARD_IMAGE} style={styles.promoImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(26,26,78,0)', 'rgba(26,26,78,0.55)', 'rgba(26,26,78,0.92)']}
            locations={[0.35, 0.65, 1]}
            style={styles.promoGradient}
          />
          <View style={styles.promoTextWrap}>
            <Text style={styles.promoTitle}>{CREDIT_PROMO.title}</Text>
            <Text style={styles.promoSubtitle}>{CREDIT_PROMO.subtitle}</Text>
          </View>
        </View>

        <View style={styles.segment}>
          <Pressable
            onPress={() => setTab('produtos')}
            style={[styles.segmentBtn, tab === 'produtos' && styles.segmentBtnActive]}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.segmentText,
                tab === 'produtos' && styles.segmentTextActive,
              ]}
            >
              Produtos
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('simulador')}
            style={[styles.segmentBtn, tab === 'simulador' && styles.segmentBtnActive]}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.segmentText,
                tab === 'simulador' && styles.segmentTextActive,
              ]}
            >
              Simulador
            </Text>
          </Pressable>
        </View>

        {tab === 'produtos' ? (
          <View style={styles.grid}>
            {CREDIT_PRODUCTS.map((product) => (
              <CreditTile
                key={product.id}
                product={product}
                size={tileSize}
                onPress={() => openProduct(product)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.simulator}>
            <CreditSelectField
              label="Produto"
              value={selectedProduct}
              onPress={() => setProductModalOpen(true)}
            />

            <CreditTextField
              label="Montante a solicitar"
              value={amountFormatted}
              onChangeText={(t) => setAmountDigits(normalizeDigits(t))}
              placeholder="0,00"
              keyboardType="numeric"
              inputMode="numeric"
            />
            <View style={styles.minMax}>
              <Text style={styles.minMaxText}>Mín: 2 000,00</Text>
              <Text style={styles.minMaxText}>Máx: 50 000,00</Text>
            </View>

            <View style={styles.fees}>
              <FeeRow label="Comissão de Utilização" value="15%" />
              <FeeRow label="IVA (Sobre Comissão)" value="14%" />
              <FeeRow label="Juro de Mora" value="4%" />
              <FeeRow label="TAEG" value="105%" bold />
            </View>

            <Pressable
              style={styles.simulateBtn}
              accessibilityRole="button"
              onPress={() => setSimModalOpen(true)}
            >
              <Text style={styles.simulateText}>Simular</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={sheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeProductModal}
      >
        <Animated.View
          pointerEvents={productModalOpen ? 'auto' : 'none'}
          style={[styles.modalOverlay, { opacity: overlayOpacity }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeProductModal} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
          <View style={styles.sheetTopRow}>
            <Pressable
              onPress={closeProductModal}
              style={styles.sheetClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Ionicons name="close" size={18} color="#111827" />
            </Pressable>
          </View>

          <Text style={styles.sheetTitle}>Seleccionar Produto</Text>

          <View style={styles.sheetList}>
            {products.map((p) => {
              const selected = p === selectedProduct;
              return (
                <Pressable
                  key={p}
                  style={styles.sheetItem}
                  accessibilityRole="button"
                  onPress={() => {
                    setSelectedProduct(p);
                    closeProductModal();
                  }}
                >
                  <Text style={styles.sheetItemText}>{p}</Text>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </Modal>

      <Modal
        visible={simSheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeSimModal}
      >
        <Animated.View
          pointerEvents={simModalOpen ? 'auto' : 'none'}
          style={[styles.modalOverlay, { opacity: simOverlayOpacity }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSimModal} />
        </Animated.View>

        <Animated.View
          style={[
            styles.simSheet,
            {
              transform: [{ translateY: simSheetTranslateY }],
            },
          ]}
        >
          <Pressable
            onPress={closeSimModal}
            style={styles.simClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <Ionicons name="close" size={18} color="#111827" />
          </Pressable>

          <Text style={styles.simTitle}>Detalhes da simulação</Text>

          <View style={styles.simRows}>
            <SimRow label="Produto" value="Maka Zero" />
            <SimRow label="Montante Solicitado" value={simAmount} />
            <SimRow label="Comissão de Utilização" value="5.700,00 kz" />
            <SimRow label="IVA" value="300,00 kz" />
          </View>

          <Text style={styles.simReceiveLabel}>Montante a Receber</Text>
          <View style={styles.simReceiveBox}>
            <Text style={styles.simReceiveValue}>44.000,00 kz</Text>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

function SimRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.simRow}>
      <Text style={styles.simLabel}>{label}</Text>
      <Text style={styles.simValue}>{value}</Text>
    </View>
  );
}

function normalizeDigits(text: string) {
  const digits = text.replace(/[^\d]/g, '');
  return digits.slice(0, 12);
}

function formatMoneyFromDigitsAsCents(digits: string) {
  if (!digits) return '';
  const cents = Number(digits);
  if (!Number.isFinite(cents)) return '';
  return (cents / 100).toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function FeeRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.feeRow}>
      <Text style={styles.feeLabel}>{label}</Text>
      <Text style={[styles.feeValue, bold && styles.feeValueBold]}>{value}</Text>
    </View>
  );
}

function CreditTile({
  product,
  size,
  onPress,
}: {
  product: CreditProduct;
  size: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.tile, { width: size }]}
      accessibilityRole="button"
      accessibilityLabel={product.label}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <Ionicons name={product.icon} size={28} color="#111827" />
      </View>
      <Text style={styles.tileLabel}>{product.label}</Text>
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
    gap: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerAction: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActionText: {
    fontSize: 11,
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
  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 22,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  segmentTextActive: {
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginTop: 22,
  },
  tile: {
    alignItems: 'center',
  },
  iconBox: {
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 14,
  },
  simulator: {
    marginTop: 22,
  },
  minMax: {
    marginTop: -8,
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  minMaxText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 16,
  },
  fees: {
    marginTop: 18,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  feeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  feeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  feeValueBold: {
    fontWeight: '800',
  },
  simulateBtn: {
    marginTop: 26,
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    paddingTop: 14,
    paddingBottom: 28,
    minHeight: 360,
  },
  sheetTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  sheetList: {
    marginTop: 26,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  sheetItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#111827',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },
  simSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
    minHeight: 420,
  },
  simClose: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.2,
    borderColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  simTitle: {
    marginTop: 36,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  simRows: {
    marginTop: 18,
  },
  simRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  simLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  simValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  simReceiveLabel: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  simReceiveBox: {
    marginTop: 12,
    height: 86,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simReceiveValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
});
