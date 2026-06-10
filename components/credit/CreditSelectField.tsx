import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
};

export function CreditSelectField({ label, value, placeholder, onPress }: Props) {
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
});
