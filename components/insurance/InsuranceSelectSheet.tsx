import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { INSURANCE_ACCENT } from '@/constants/insurance';

type Props = {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export function InsuranceSelectSheet({
  visible,
  title,
  options,
  selected,
  onClose,
  onSelect,
}: Props) {
  const insets = useSafeAreaInsets();
  const sheetY = useRef(new Animated.Value(420)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      sheetY.setValue(420);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(sheetY, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
      return;
    }
    if (!mounted) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 420, duration: 320, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, mounted, overlayOpacity, sheetY]);

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: sheetY }],
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}>
        <Pressable style={styles.close} onPress={onClose} accessibilityRole="button">
          <Ionicons name="close" size={18} color="#111827" />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((option) => {
            const isSelected = option === selected;
            return (
              <Pressable
                key={option}
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}>
                <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>{option}</Text>
                {isSelected ? <Ionicons name="checkmark" size={18} color={INSURANCE_ACCENT} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 18,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowSelected: {
    backgroundColor: '#F9FAFB',
  },
  rowText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  rowTextSelected: {
    fontWeight: '700',
    color: INSURANCE_ACCENT,
  },
});
