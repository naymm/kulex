import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { CardDetailsOverlay } from '@/components/cards/CardDetailsOverlay';
import { PostpaidCardPreview } from '@/components/cards/PostpaidCardPreview';
import type { WalletCard } from '@/constants/card';
import { WALLET_CARD_ASPECT } from '@/constants/card';

const NAVY = '#1A1A4E';
const CARD_ASSET = require('../../assets/images/cartao.png');
const CARD_GAP = 14;

type Props = {
  cards: WalletCard[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  isFrozen?: boolean;
};

export function CardWalletCarousel({
  cards,
  activeIndex,
  onActiveIndexChange,
  isFrozen = false,
}: Props) {
  const [layoutWidth, setLayoutWidth] = useState(Dimensions.get('window').width);

  const cardWidth = useMemo(() => layoutWidth - 56, [layoutWidth]);
  const cardHeight = cardWidth / WALLET_CARD_ASPECT;
  const snapInterval = cardWidth + CARD_GAP;
  const sideInset = (layoutWidth - cardWidth) / 2;

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / snapInterval);
      onActiveIndexChange(Math.min(Math.max(index, 0), cards.length - 1));
    },
    [cards.length, onActiveIndexChange, snapInterval],
  );

  const renderItem: ListRenderItem<WalletCard> = useCallback(
    ({ item }) => {
      const displayAmount =
        item.kind === 'prepaid' ? item.balance : item.available;

      return (
      <View style={[styles.slide, { width: cardWidth + CARD_GAP }]}>
        <View style={[styles.cardShell, { width: cardWidth }]}>
          {item.kind === 'prepaid' ? (
            <View
              style={[
                styles.cardWrap,
                { width: cardWidth, height: cardHeight },
                isFrozen && styles.cardWrapFrozen,
              ]}>
              <Image
                source={CARD_ASSET}
                style={[
                  { width: cardWidth, height: cardHeight },
                  isFrozen && styles.cardImageFrozen,
                ]}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
              <CardDetailsOverlay
                cardNumber={item.cardNumber}
                expiry={item.expiry}
                typeLabel={item.typeLabel}
                amount={displayAmount}
                cardWidth={cardWidth}
                dimmed={isFrozen}
              />
              {isFrozen ? (
                <View style={styles.frozenOverlay}>
                  <Ionicons name="snow" size={28} color="#FFFFFF" />
                  <Text style={styles.frozenLabel}>Cartão congelado</Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View
              style={[
                styles.cardWrap,
                { width: cardWidth, height: cardHeight },
              ]}>
              <PostpaidCardPreview
                cardTierId={item.tierId}
                width={cardWidth}
                height={cardHeight}
                embedded
              />
              <CardDetailsOverlay
                cardNumber={item.cardNumber}
                expiry={item.expiry}
                typeLabel={item.typeLabel}
                amount={displayAmount}
                cardWidth={cardWidth}
              />
            </View>
          )}
        </View>
      </View>
      );
    },
    [cardHeight, cardWidth, isFrozen],
  );

  return (
    <View
      style={styles.container}
      onLayout={(event) => setLayoutWidth(event.nativeEvent.layout.width)}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        disableIntervalMomentum
        bounces={false}
        contentContainerStyle={{ paddingHorizontal: sideInset }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
      />

      <View style={styles.dots}>
        {cards.map((card, index) => {
          const active = index === activeIndex;
          return (
            <View
              key={card.id}
              style={[styles.dot, active ? styles.dotActive : styles.dotInactive]}
            />
          );
        })}
      </View>

      <Text style={styles.activeLabel}>
        {cards[activeIndex]?.typeLabel} · {cards[activeIndex]?.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -18,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardShell: {
    paddingRight: CARD_GAP,
  },
  cardWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },
  cardWrapFrozen: {
    shadowOpacity: 0.08,
    elevation: 2,
  },
  cardImageFrozen: {
    opacity: 0.38,
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  frozenLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  dot: {
    borderRadius: 999,
  },
  dotActive: {
    width: 22,
    height: 8,
    backgroundColor: NAVY,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: '#D1D5DB',
  },
  activeLabel: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
