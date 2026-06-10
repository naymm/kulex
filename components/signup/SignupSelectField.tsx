import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label?: string;
  value?: string;
  placeholder?: string;
  onPress: () => void;
  leftSlot?: ReactNode;
};

export function SignupSelectField({
  label,
  value,
  placeholder,
  onPress,
  leftSlot,
}: Props) {
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <Pressable style={styles.selectField} onPress={onPress} accessibilityRole="button">
        <View style={styles.selectLeft}>
          {leftSlot}
          <Text style={[styles.selectText, !value && styles.placeholderText]} numberOfLines={1}>
            {value || placeholder}
          </Text>
        </View>
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
  selectLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
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
