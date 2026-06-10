import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FlatList as FlatListType } from 'react-native';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { PostpaidCardPreview } from '@/components/cards/PostpaidCardPreview';
import { WALLET_CARD_ASPECT } from '@/constants/card';
import type { PostpaidCardProduct } from '@/constants/postpaid-card';

const NAVY = '#1A1A4E';
const CARD_GAP = 14;

type Props = {
  cards: PostpaidCardProduct[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

export function PostpaidCardTierCarousel({
  cards,
  activeIndex,
  onActiveIndexChange,
}: Props) {
  const listRef = useRef<FlatListType<PostpaidCardProduct>>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const [layoutWidth, setLayoutWidth] = useState(Dimensions.get('window').width);

  const cardWidth = useMemo(() => Math.min(layoutWidth - 72, 300), [layoutWidth]);
  const cardHeight = cardWidth / WALLET_CARD_ASPECT;
  const snapInterval = cardWidth + CARD_GAP;
  const sideInset = (layoutWidth - cardWidth) / 2;

  const clampIndex = useCallback(
    (index: number) => Math.min(Math.max(index, 0), Math.max(cards.length - 1, 0)),
    [cards.length],
  );

  const scrollToIndex = useCallback(
    (index: number, animated: boolean) => {
      if (cards.length === 0 || snapInterval <= 0) return;
      const safeIndex = clampIndex(index);
      listRef.current?.scrollToOffset({
        offset: safeIndex * snapInterval,
        animated,
      });
    },
    [cards.length, clampIndex, snapInterval],
  );

  useEffect(() => {
    if (cards.length === 0 || snapInterval <= 0) return;

    const frame = requestAnimationFrame(() => {
      scrollToIndex(activeIndexRef.current, false);
    });

    return () => cancelAnimationFrame(frame);
  }, [cards.length, scrollToIndex, snapInterval, layoutWidth]);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = clampIndex(Math.round(offsetX / snapInterval));
      onActiveIndexChange(index);
    },
    [clampIndex, onActiveIndexChange, snapInterval],
  );

  const renderItem: ListRenderItem<PostpaidCardProduct> = useCallback(
    ({ item }) => (
      <View style={[styles.slide, { width: cardWidth + CARD_GAP }]}>
        <View style={[styles.cardShell, { width: cardWidth }]}>
          <PostpaidCardPreview
            cardTierId={item.id}
            width={cardWidth}
            height={cardHeight}
          />
        </View>
      </View>
    ),
    [cardHeight, cardWidth],
  );

  const activeCard = cards[activeIndex];

  return (
    <View
      style={styles.container}
      onLayout={(event) => setLayoutWidth(event.nativeEvent.layout.width)}>
      <FlatList
        ref={listRef}
        data={cards}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        disableIntervalMomentum
        bounces={false}
        initialScrollIndex={clampIndex(activeIndex)}
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

      {activeCard ? (
        <View style={styles.labelWrap}>
          <Text style={styles.activeLabel}>{activeCard.label}</Text>
          <Text style={styles.activeRange}>Plafond AOA {activeCard.rangeLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -20,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardShell: {
    paddingRight: CARD_GAP,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
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
  labelWrap: {
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  activeLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  activeRange: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
});
