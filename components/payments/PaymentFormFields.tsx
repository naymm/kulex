import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import { INSURANCE_ACCENT } from '@/constants/insurance';
import { formatMoneyFromDigitsAsCents, normalizeDigits } from '@/lib/money';

type SelectProps = {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
};

export function PaymentSelectField({ label, value, placeholder, onPress }: SelectProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.selectField} onPress={onPress} accessibilityRole="button">
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </Pressable>
    </View>
  );
}

type TextProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
};

export function PaymentTextField({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = 'default',
}: TextProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        style={[styles.input, focused && styles.inputFocused]}
        underlineColorAndroid="transparent"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

type EntityProps = {
  label: string;
  entityDigits: string;
  entityName?: string;
  placeholder?: string;
  onChangeEntityDigits: (digits: string) => void;
};

export function PaymentEntityField({
  label,
  entityDigits,
  entityName = '',
  placeholder,
  onChangeEntityDigits,
}: EntityProps) {
  const [focused, setFocused] = useState(false);
  const showName = entityDigits.length >= 5 && entityName.length > 0;

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.entityField, focused && styles.inputFocused]}>
        <TextInput
          value={entityDigits}
          onChangeText={onChangeEntityDigits}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          style={[styles.entityInput, showName && styles.entityInputCompact]}
          underlineColorAndroid="transparent"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {showName ? <Text style={styles.entityName}> - {entityName}</Text> : null}
      </View>
    </View>
  );
}

type PhoneProps = {
  label: string;
  value: string;
  placeholder?: string;
  flag: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
};

export function PaymentPhoneField({
  label,
  value,
  placeholder,
  flag,
  onChangeText,
  keyboardType = 'phone-pad',
}: PhoneProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.phoneField, focused && styles.inputFocused]}>
        <Text style={styles.flag}>{flag}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          style={styles.phoneInput}
          underlineColorAndroid="transparent"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

type AmountProps = {
  label: string;
  amountDigits: string;
  onChangeAmountDigits: (digits: string) => void;
  hint?: string;
};

export function PaymentAmountField({
  label,
  amountDigits,
  onChangeAmountDigits,
  hint = 'Toque para introduzir o valor',
}: AmountProps) {
  const insets = useSafeAreaInsets();
  const [keypadOpen, setKeypadOpen] = useState(false);

  const amountPreview = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits || '0'),
    [amountDigits],
  );

  const addDigit = (digit: string) => {
    onChangeAmountDigits(normalizeDigits(amountDigits + digit));
  };

  const deleteDigit = () => {
    onChangeAmountDigits(amountDigits.slice(0, -1));
  };

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        style={[styles.amountField, keypadOpen && styles.inputFocused]}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setKeypadOpen(true)}>
        <View style={styles.amountRow}>
          <Text style={styles.amountCurrency}>AOA </Text>
          <Text style={[styles.amountValue, !amountDigits && styles.placeholderText]}>
            {amountDigits ? amountPreview : '0,00'}
          </Text>
        </View>
        <Text style={styles.amountHint}>{hint}</Text>
      </Pressable>

      <Modal
        visible={keypadOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setKeypadOpen(false)}>
        <View style={styles.keypadModal}>
          <Pressable style={styles.keypadOverlay} onPress={() => setKeypadOpen(false)} />
          <View style={[styles.keypadSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.keypadHandle} />
            <Text style={styles.keypadTitle}>{label}</Text>
            <View style={styles.keypadAmountRow}>
              <Text style={styles.keypadCurrency}>AOA </Text>
              <Text style={styles.keypadAmount}>{amountPreview}</Text>
            </View>
            <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="light" />
            <Pressable
              style={styles.keypadDoneBtn}
              accessibilityRole="button"
              onPress={() => setKeypadOpen(false)}>
              <Text style={styles.keypadDoneText}>Concluído</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  selectField: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
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
    borderColor: INSURANCE_ACCENT,
  },
  entityField: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  entityInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 12,
  },
  entityInputCompact: {
    flex: 0,
    minWidth: 52,
  },
  entityName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  phoneField: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  flag: {
    fontSize: 18,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 0,
  },
  amountField: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountCurrency: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  amountHint: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  keypadModal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keypadOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  keypadSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  keypadHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
  },
  keypadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  keypadAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  keypadCurrency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  keypadAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A4E',
    letterSpacing: -0.5,
  },
  keypadDoneBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadDoneText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
