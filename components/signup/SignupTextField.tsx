import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordField = Boolean(secureTextEntry);

  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          inputMode={inputMode}
          placeholderTextColor={placeholderTextColor}
          maxLength={maxLength}
          secureTextEntry={isPasswordField && !passwordVisible}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textAlign={textAlign}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            focused && styles.inputFocused,
            isPasswordField && styles.inputWithToggle,
            inputStyle,
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPasswordField ? (
          <Pressable
            style={styles.toggleBtn}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => setPasswordVisible((current) => !current)}>
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6B7280"
            />
          </Pressable>
        ) : null}
      </View>
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
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
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
  inputWithToggle: {
    paddingRight: 48,
  },
  inputFocused: {
    borderColor: CREDIT_ACCENT,
  },
  toggleBtn: {
    position: 'absolute',
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
