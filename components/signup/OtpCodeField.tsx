import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export function OtpCodeField({ value, onChange, length = 6 }: Props) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.replace(/\D/g, '').slice(0, length);

  return (
    <View>
      <Pressable style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length }).map((_, index) => (
          <View key={index} style={styles.otpBox}>
            <Text style={styles.otpDigit}>{digits[index] ?? ''}</Text>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={digits}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpBox: {
    flex: 1,
    maxWidth: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
