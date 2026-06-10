import { Pressable, StyleSheet, Text, View } from 'react-native';

type PinPadProps = {
  onDigit: (digit: string) => void;
  onDelete: () => void;
};

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete'],
] as const;

export function PinPad({ onDigit, onDelete }: PinPadProps) {
  return (
    <View style={styles.pad}>
      {ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            if (key === '') {
              return <View key="spacer" style={styles.key} />;
            }
            if (key === 'delete') {
              return (
                <Pressable
                  key="delete"
                  style={styles.key}
                  accessibilityRole="button"
                  onPress={onDelete}>
                  <Text style={styles.deleteText}>Apagar</Text>
                </Pressable>
              );
            }
            return (
              <Pressable
                key={key}
                style={styles.key}
                accessibilityRole="button"
                onPress={() => onDigit(key)}>
                <Text style={styles.digit}>{key}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function PinDots({ length, filled }: { length: number; filled: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[styles.dot, i < filled && styles.dotFilled]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  key: {
    width: 88,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digit: { fontSize: 28, fontWeight: '400', color: '#111827' },
  deleteText: { fontSize: 18, fontWeight: '500', color: '#166534' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
    marginBottom: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: '#111827' },
});
