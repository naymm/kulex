import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import { WALLET_CARD_ASPECT } from '@/constants/card';
import { getCardProductById, type PostpaidCardTierId } from '@/constants/postpaid-card';

type Props = {
  cardTierId?: PostpaidCardTierId | string;
  width?: number;
  height?: number;
  /** Sem sombra/borda — quando o cartão está dentro de outro contentor */
  embedded?: boolean;
};

export function PostpaidCardPreview({
  cardTierId = 'branco',
  width = 300,
  height,
  embedded = false,
}: Props) {
  const product = getCardProductById(cardTierId);
  const cardHeight = height ?? width / WALLET_CARD_ASPECT;

  const content = product.image ? (
    <Image
      source={product.image}
      style={{ width, height: cardHeight }}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
    />
  ) : (
    <LinearGradient
      colors={product.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { width, height: cardHeight }]}>
      <View style={styles.topRow}>
        <Text style={[styles.brand, { color: product.textColor }]}>Kulex</Text>
        <View style={styles.mastercard}>
          <View style={[styles.masterCircle, styles.masterRed]} />
          <View style={[styles.masterCircle, styles.masterYellow]} />
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={[styles.cardType, { color: product.textColor }]}>
          {product.label.toUpperCase()}
        </Text>
        <Text style={[styles.network, { color: product.textColor }]}>Mastercard</Text>
      </View>
    </LinearGradient>
  );

  if (embedded) {
    return content;
  }

  return (
    <View style={[styles.wrap, { width, height: cardHeight }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  card: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  mastercard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  masterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  masterRed: {
    backgroundColor: '#EB001B',
    marginRight: -8,
    opacity: 0.95,
  },
  masterYellow: {
    backgroundColor: '#F79E1B',
    opacity: 0.95,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardType: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    flex: 1,
    paddingRight: 8,
  },
  network: {
    fontSize: 12,
    fontWeight: '700',
  },
});
