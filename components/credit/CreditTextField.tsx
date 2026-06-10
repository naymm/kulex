import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { CREDIT_ACCENT } from '@/constants/credit';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
} & Pick<TextInputProps, 'placeholder' | 'keyboardType' | 'inputMode' | 'placeholderTextColor'>;

export function CreditTextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  inputMode,
  placeholderTextColor = '#9CA3AF',
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        inputMode={inputMode}
        placeholderTextColor={placeholderTextColor}
        underlineColorAndroid="transparent"
        style={[styles.input, focused && styles.inputFocused]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: CREDIT_ACCENT,
  },
});
