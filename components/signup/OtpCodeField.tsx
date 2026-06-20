import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
};

export function OtpCodeField({ value, onChange, length = 6, error }: Props) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.replace(/\D/g, '').slice(0, length);
  const hasError = Boolean(error);

  return (
    <View>
      <Pressable style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length }).map((_, index) => (
          <View key={index} style={[styles.otpBox, hasError && styles.otpBoxError]}>
            <Text style={styles.otpDigit}>{digits[index] ?? ''}</Text>
          </View>
        ))}
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  otpBoxError: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#EF4444',
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
  errorText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#DC2626',
    textAlign: 'center',
  },
});
