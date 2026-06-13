import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getServicoRoutePath, SERVICOS, type ServicoItem } from '@/constants/servicos';

const NAVY = '#1A1A4E';
const NUM_COLUMNS = 4;
const HORIZONTAL_PADDING = 18;
const GRID_GAP = 14;

export default function BusinessServicosTabScreen() {
  const insets = useSafeAreaInsets();

  const tileSize = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    return (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
  }, []);

  const openServico = (servico: ServicoItem) => {
    router.push({
      pathname: getServicoRoutePath(servico.route) as never,
      params: { provider: servico.route.provider },
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Serviços</Text>
        <Text style={styles.headerSubtitle}>ENDE, TV, internet e outros pagamentos</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {SERVICOS.map((servico) => (
            <Pressable
              key={servico.id}
              style={[styles.tile, { width: tileSize }]}
              accessibilityRole="button"
              accessibilityLabel={servico.label}
              onPress={() => openServico(servico)}>
              <View style={[styles.logoBox, { width: tileSize, height: tileSize }]}>
                <Image source={servico.logo} style={styles.logo} resizeMode="cover" />
              </View>
              <Text style={styles.tileLabel}>{servico.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.stockCreditLink}
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/business-credito')}>
          <Ionicons name="cube-outline" size={22} color={NAVY} />
          <View style={styles.stockCreditLinkText}>
            <Text style={styles.stockCreditLinkTitle}>Crédito de stock</Text>
            <Text style={styles.stockCreditLinkSubtitle}>
              Capital de giro para reforço de stock da loja
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>

        <Pressable
          style={styles.paymentsLink}
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/payments')}>
          <Ionicons name="card-outline" size={22} color={NAVY} />
          <View style={styles.paymentsLinkText}>
            <Text style={styles.paymentsLinkTitle}>Mais pagamentos</Text>
            <Text style={styles.paymentsLinkSubtitle}>Referência, Estado, Seguros e QR Code</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 1,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 8, marginTop: 28 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginBottom: 16,
  },
  tile: { alignItems: 'center' },
  logoBox: { borderRadius: 12, overflow: 'hidden' },
  logo: { width: '100%', height: '100%' },
  tileLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 14,
  },
  stockCreditLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  stockCreditLinkText: { flex: 1 },
  stockCreditLinkTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  stockCreditLinkSubtitle: { marginTop: 3, fontSize: 12, fontWeight: '500', color: '#6B7280' },
  paymentsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentsLinkText: { flex: 1 },
  paymentsLinkTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  paymentsLinkSubtitle: { marginTop: 3, fontSize: 12, fontWeight: '500', color: '#6B7280' },
});
