import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CARD_CVV, CARD_NUMBER_FULL, CARD_NUMBER_RAW } from '@/constants/card';
import type { CardTypeLabel } from '@/constants/card';

const CARD_NATIVE_WIDTH = 329;

type Props = {
  cardNumber: string;
  expiry: string;
  typeLabel?: CardTypeLabel;
  amount?: string;
  cardNumberFull?: string;
  cardNumberRaw?: string;
  showDetails?: boolean;
  cardWidth: number;
  dimmed?: boolean;
};

export function CardDetailsOverlay({
  cardNumber,
  expiry,
  typeLabel,
  amount,
  cardNumberFull = CARD_NUMBER_FULL,
  cardNumberRaw = CARD_NUMBER_RAW,
  showDetails = false,
  cardWidth,
  dimmed = false,
}: Props) {
  const scale = cardWidth / CARD_NATIVE_WIDTH;
  const s = (value: number) => value * scale;

  const copyNumber = async () => {
    await Clipboard.setStringAsync(cardNumberRaw);
  };

  const displayNumber = showDetails ? cardNumberFull : cardNumber;
  const numberSize = s(14);
  const balanceSize = s(17);

  return (
    <View style={[styles.overlay, dimmed && styles.overlayDimmed]} pointerEvents="box-none">
      <View
        style={[
          styles.centerBlock,
          {
            left: s(22),
            top: s(58),
            bottom: s(42),
            gap: s(10),
          },
        ]}>
        <View style={styles.numberRow}>
          <Text style={[styles.number, { fontSize: numberSize, letterSpacing: s(1.4) }]}>
            {displayNumber}
          </Text>
          {showDetails ? (
            <Pressable
              style={[
                styles.copyBtn,
                { width: s(28), height: s(28), borderRadius: s(14), marginLeft: s(8) },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Copiar número do cartão"
              onPress={copyNumber}>
              <Ionicons name="copy-outline" size={s(14)} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>

        {amount ? (
          <Text style={[styles.balance, { fontSize: balanceSize, letterSpacing: s(0.4) }]}>
            {amount}
          </Text>
        ) : null}
      </View>

      {typeLabel ? (
        <View
          style={[
            styles.typeBadge,
            {
              left: s(22),
              bottom: s(14),
              paddingHorizontal: s(10),
              paddingVertical: s(4),
              borderRadius: s(6),
            },
          ]}>
          <Text style={[styles.typeBadgeText, { fontSize: s(10), letterSpacing: s(0.3) }]}>
            {typeLabel}
          </Text>
        </View>
      ) : null}

      <View style={[styles.metaRow, { right: s(20), bottom: s(16), gap: s(22) }]}>
        <View style={styles.metaBlock}>
          <Text style={[styles.metaLabel, { fontSize: s(7), letterSpacing: s(0.5) }]}>VALIDADE</Text>
          <Text style={[styles.metaValue, { fontSize: s(12), marginTop: s(2) }]}>{expiry}</Text>
        </View>
        {showDetails ? (
          <View style={styles.metaBlock}>
            <Text style={[styles.metaLabel, { fontSize: s(7), letterSpacing: s(0.5) }]}>CVV</Text>
            <Text style={[styles.metaValue, { fontSize: s(12), marginTop: s(2) }]}>{CARD_CVV}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  overlayDimmed: {
    opacity: 0.45,
  },
  centerBlock: {
    position: 'absolute',
    justifyContent: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  number: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  copyBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balance: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  typeBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  metaRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  metaBlock: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
  },
  metaValue: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
