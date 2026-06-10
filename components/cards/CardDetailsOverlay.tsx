import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CARD_CVV,
  CARD_EXPIRY,
  CARD_BALANCE,
  CARD_NUMBER_FULL,
  CARD_NUMBER_MASKED,
  CARD_NUMBER_RAW,
} from '@/constants/card';

const CARD_NATIVE_WIDTH = 329;

type Props = {
  showDetails: boolean;
  cardWidth: number;
  dimmed?: boolean;
};

export function CardDetailsOverlay({ showDetails, cardWidth, dimmed = false }: Props) {
  const scale = cardWidth / CARD_NATIVE_WIDTH;
  const s = (value: number) => value * scale;

  const copyNumber = async () => {
    await Clipboard.setStringAsync(CARD_NUMBER_RAW);
  };

  return (
    <View style={[styles.overlay, dimmed && styles.overlayDimmed]} pointerEvents="box-none">
      <View style={[styles.numberRow, { left: s(22) }]}>
        <Text style={[styles.number, { fontSize: s(14), letterSpacing: s(1.4) }]}>
          {showDetails ? CARD_NUMBER_FULL : CARD_NUMBER_MASKED}
        </Text>
        {showDetails ? (
          <Pressable
            style={[styles.copyBtn, { width: s(28), height: s(28), borderRadius: s(14), marginLeft: s(8) }]}
            accessibilityRole="button"
            accessibilityLabel="Copiar número do cartão"
            onPress={copyNumber}>
            <Ionicons name="copy-outline" size={s(14)} color="#FFFFFF" />
          </Pressable>
        ) : null}
      </View>

      <Text
        style={[
          styles.balance,
          { left: s(22), bottom: s(19), fontSize: s(17), letterSpacing: s(0.4) },
        ]}>
        {CARD_BALANCE}
      </Text>

      {showDetails ? (
        <View style={[styles.metaRow, { right: s(20), bottom: s(14), gap: s(22) }]}>
          <View>
            <Text style={[styles.metaLabel, { fontSize: s(7), letterSpacing: s(0.5) }]}>VALIDADE</Text>
            <Text style={[styles.metaValue, { fontSize: s(12), marginTop: s(2) }]}>{CARD_EXPIRY}</Text>
          </View>
          <View>
            <Text style={[styles.metaLabel, { fontSize: s(7), letterSpacing: s(0.5) }]}>CVV</Text>
            <Text style={[styles.metaValue, { fontSize: s(12), marginTop: s(2) }]}>{CARD_CVV}</Text>
          </View>
        </View>
      ) : null}
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
  numberRow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  number: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  copyBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balance: {
    position: 'absolute',
    color: '#FFFFFF',
    fontWeight: '700',
  },
  metaRow: {
    position: 'absolute',
    flexDirection: 'row',
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
