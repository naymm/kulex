import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CREDIT_ACCENT } from '@/constants/credit';
import { flagEmojiFromIso2, type Country } from '@/constants/countries';
import { getCountryDialCode } from '@/constants/country-dial-codes';
import { getPhoneMaxLength, sanitizePhoneDigits } from '@/lib/phone';

type Props = {
  label?: string;
  country: Country;
  value: string;
  onChangeText: (text: string) => void;
  onPressCountry: () => void;
};

export function SignupPhoneField({
  label,
  country,
  value,
  onChangeText,
  onPressCountry,
}: Props) {
  const [focused, setFocused] = useState(false);
  const dialCode = getCountryDialCode(country.code);
  const maxLength = getPhoneMaxLength(country.code);

  const handleChange = (text: string) => {
    onChangeText(sanitizePhoneDigits(text).slice(0, maxLength));
  };

  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={styles.row}>
        <Pressable
          style={styles.prefix}
          accessibilityRole="button"
          accessibilityLabel={`Indicativo ${dialCode}`}
          onPress={onPressCountry}>
          <View style={styles.flagWrap}>
            <Text style={styles.flag}>{flagEmojiFromIso2(country.code)}</Text>
          </View>
          <Text style={styles.dialCode}>{dialCode}</Text>
          <Ionicons name="chevron-down" size={14} color="#6B7280" />
        </Pressable>

        <TextInput
          value={value}
          onChangeText={handleChange}
          placeholder="Número de telefone"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          inputMode="numeric"
          maxLength={maxLength}
          underlineColorAndroid="transparent"
          style={[styles.input, focused && styles.inputFocused]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prefix: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  flagWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    fontSize: 16,
  },
  dialCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  inputFocused: {
    borderColor: CREDIT_ACCENT,
  },
});
