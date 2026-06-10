import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
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
import { TELECOM_PROVIDERS, type TelecomProvider } from '@/constants/telecom';
import { goBackFromOrigin, withOriginParams } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const NUM_COLUMNS = 4;
const HORIZONTAL_PADDING = 20;
const GRID_GAP = 14;
const PROMO_CARD_IMAGE = require('@/assets/images/card-seguro.png');

export default function TelecomScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const tileSize = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    return (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
  }, []);

  const openProvider = (provider: TelecomProvider) => {
    router.push({
      pathname: '/payments/telecom/[provider]' as never,
      params: withOriginParams(from, { provider: provider.id }),
    });
  };

  const goBack = () => {
    goBackFromOrigin(from, () => {
      router.dismissTo('/(tabs)/payments');
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={goBack}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Telecomunicações</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {TELECOM_PROVIDERS.map((provider) => (
            <ProviderTile
              key={provider.id}
              provider={provider}
              size={tileSize}
              onPress={() => openProvider(provider)}
            />
          ))}
        </View>

        <View style={styles.promoCard}>
          <Image source={PROMO_CARD_IMAGE} style={styles.promoImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(26,26,78,0)', 'rgba(26,26,78,0.55)', 'rgba(26,26,78,0.92)']}
            locations={[0.35, 0.65, 1]}
            style={styles.promoGradient}
          />
          <View style={styles.promoTextWrap}>
            <Text style={styles.promoTitle}>Para cada momento{'\n'}da tua vida</Text>
            <Text style={styles.promoSubtitle}>
              Vantagens e descontos exclusivos em toda{'\n'}a nossa gama de seguros, viagem, saúde,{'\n'}
              habitação, automóvel e muito mais.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ProviderTile({
  provider,
  size,
  onPress,
}: {
  provider: TelecomProvider;
  size: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.tile, { width: size }]}
      accessibilityRole="button"
      accessibilityLabel={provider.label}
      onPress={onPress}>
      <View style={[styles.logoBox, { width: size, height: size }]}>
        <Image source={provider.logo} style={styles.logo} resizeMode="cover" />
      </View>
      <Text style={styles.tileLabel}>{provider.label}</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    marginBottom: 28,
  },
  tile: {
    alignItems: 'center',
  },
  logoBox: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  tileLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 14,
  },
  promoCard: {
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
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
});
