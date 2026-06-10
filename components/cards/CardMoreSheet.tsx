import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type CardMoreMenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: IoniconName;
};

export const CARD_MORE_MENU_ITEMS: CardMoreMenuItem[] = [
  {
    id: 'saque',
    title: 'Saque de fundos',
    subtitle: 'Saque do seu cartão para sua conta',
    icon: 'download-outline',
  },
  {
    id: 'extracto',
    title: 'Extracto do cartão',
    subtitle: 'Faça negócios ou trabalhe como freelancer',
    icon: 'list-outline',
  },
  {
    id: 'excluir',
    title: 'Excluir o cartão',
    subtitle: 'Encerre instantaneamente o seu cartão',
    icon: 'trash-outline',
  },
];

type CardMoreSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect?: (item: CardMoreMenuItem) => void;
};

export function CardMoreSheet({ visible, onClose, onSelect }: CardMoreSheetProps) {
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
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: sheetY }],
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}>
        <View style={styles.header}>
          <Pressable style={styles.close} accessibilityRole="button" onPress={onClose}>
            <Ionicons name="close" size={18} color="#111827" />
          </Pressable>
          <Text style={styles.title}>Mais</Text>
        </View>

        <View style={styles.list}>
          {CARD_MORE_MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.id}
              style={[styles.row, index < CARD_MORE_MENU_ITEMS.length - 1 && styles.rowBorder]}
              accessibilityRole="button"
              onPress={() => {
                onSelect?.(item);
                onClose();
              }}>
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={20} color="#111827" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            </Pressable>
          ))}
        </View>
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
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
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  list: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  rowSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 18,
  },
});
