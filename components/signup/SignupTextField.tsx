import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  View,
} from 'react-native';
import { CREDIT_ACCENT } from '@/constants/credit';

type Props = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  inputStyle?: StyleProp<TextStyle>;
} & Pick<
  TextInputProps,
  | 'placeholder'
  | 'keyboardType'
  | 'inputMode'
  | 'placeholderTextColor'
  | 'maxLength'
  | 'secureTextEntry'
  | 'autoCapitalize'
  | 'autoCorrect'
  | 'textAlign'
>;

export function SignupTextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  inputMode,
  placeholderTextColor = '#9CA3AF',
  maxLength,
  secureTextEntry,
  autoCapitalize,
  autoCorrect,
  textAlign,
  inputStyle,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        inputMode={inputMode}
        placeholderTextColor={placeholderTextColor}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        textAlign={textAlign}
        underlineColorAndroid="transparent"
        style={[styles.input, focused && styles.inputFocused, inputStyle]}
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
