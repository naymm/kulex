import { Pressable, StyleSheet, Text, View } from 'react-native';

type NumericKeypadProps = {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  variant?: 'dark' | 'light';
};

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete'],
] as const;

export function NumericKeypad({ onDigit, onDelete, variant = 'dark' }: NumericKeypadProps) {
  const isDark = variant === 'dark';

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
                  <Text style={[styles.deleteText, isDark && styles.deleteTextDark]}>Apagar</Text>
                </Pressable>
              );
            }
            return (
              <Pressable
                key={key}
                style={styles.key}
                accessibilityRole="button"
                onPress={() => onDigit(key)}>
                <Text style={[styles.digit, isDark && styles.digitDark]}>{key}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function PinDots({
  length,
  filled,
  variant = 'dark',
}: {
  length: number;
  filled: number;
  variant?: 'dark' | 'light';
}) {
  const isDark = variant === 'dark';

  return (
    <View style={styles.dots}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            isDark && styles.dotDark,
            i < filled && (isDark ? styles.dotFilledDark : styles.dotFilled),
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 18 },
  key: {
    width: 88,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digit: { fontSize: 28, fontWeight: '400', color: '#111827' },
  digitDark: { color: '#FFFFFF', fontWeight: '500' },
  deleteText: { fontSize: 18, fontWeight: '500', color: '#166534' },
  deleteTextDark: { color: '#FFFFFF', fontWeight: '400' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginTop: 36,
    marginBottom: 8,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#111827',
    backgroundColor: 'transparent',
  },
  dotDark: { borderColor: '#FFFFFF' },
  dotFilled: { backgroundColor: '#111827' },
  dotFilledDark: { backgroundColor: '#FFFFFF' },
});
