import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BANKS, type Bank } from '@/constants/banks';

type Props = {
  visible: boolean;
  onClose: () => void;
  selected: Bank;
  onSelect: (bank: Bank) => void;
};

export function BankSelectSheet({ visible, onClose, selected, onSelect }: Props) {
  const insets = useSafeAreaInsets();
  const screenH = Dimensions.get('window').height;
  const sheetY = useRef(new Animated.Value(screenH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      sheetY.setValue(screenH);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(sheetY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
      return;
    }
    if (!mounted) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: screenH, duration: 320, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, mounted, overlayOpacity, sheetY, screenH]);

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
          { transform: [{ translateY: sheetY }], paddingTop: insets.top + 12 },
        ]}>
        <Pressable style={styles.close} onPress={onClose} accessibilityRole="button">
          <Ionicons name="close" size={18} color="#111827" />
        </Pressable>
        <Text style={styles.sheetTitle}>Escolha um banco</Text>
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {BANKS.map((bank) => {
            const isSelected = bank.id === selected.id;
            return (
              <Pressable
                key={bank.id}
                style={styles.item}
                onPress={() => {
                  onSelect(bank);
                  onClose();
                }}>
                <View style={styles.logoWrap}>
                  <Image source={bank.logo} style={styles.logo} resizeMode="contain" />
                </View>
                <Text style={styles.name}>{bank.name}</Text>
                <View style={[styles.radio, isSelected && styles.radioOn]}>
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8ECF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: { marginTop: 20, fontSize: 26, fontWeight: '700', color: '#111827' },
  list: { marginTop: 12 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  logo: { width: 28, height: 28 },
  name: { flex: 1, fontSize: 15, fontWeight: '500', color: '#111827' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOn: { borderColor: '#111827' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#111827' },
});
