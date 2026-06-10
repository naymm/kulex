import { StyleSheet, Text, View } from 'react-native';
import type { CardTypeLabel } from '@/constants/card';
import { WALLET_CARD_WIDTH } from '@/constants/card';

type Props = {
  label: CardTypeLabel;
  cardWidth: number;
};

export function CardTypeBadge({ label, cardWidth }: Props) {
  const scale = cardWidth / WALLET_CARD_WIDTH;

  return (
    <View
      style={[
        styles.badge,
        {
          right: 14 * scale,
          bottom: 14 * scale,
          paddingHorizontal: 10 * scale,
          paddingVertical: 4 * scale,
          borderRadius: 6 * scale,
        },
      ]}
      pointerEvents="none">
      <Text style={[styles.text, { fontSize: 10 * scale, letterSpacing: 0.4 * scale }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
