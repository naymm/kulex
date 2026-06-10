import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type HomeMoreMenuItem = {
  id: string;
  label: string;
  icon: IoniconName;
};

export const HOME_MORE_MENU_ITEMS: HomeMoreMenuItem[] = [
  { id: 'movimentos', label: 'Movimentos', icon: 'swap-horizontal' },
  { id: 'kixikila', label: 'Kixikila', icon: 'globe-outline' },
  { id: 'remessas', label: 'Remessas', icon: 'globe-outline' },
  { id: 'seguros', label: 'Seguros', icon: 'briefcase-outline' },
  { id: 'investimentos', label: 'Investimentos', icon: 'trending-up-outline' },
];

type HomeMoreMenuProps = {
  visible: boolean;
  anchor: { x: number; y: number; width: number; height: number };
  onClose: () => void;
  onSelect?: (item: HomeMoreMenuItem) => void;
  items?: HomeMoreMenuItem[];
};

const MENU_WIDTH = 240;

export function HomeMoreMenu({
  visible,
  anchor,
  onClose,
  onSelect,
  items = HOME_MORE_MENU_ITEMS,
}: HomeMoreMenuProps) {
  const left = anchor.x + anchor.width - MENU_WIDTH;
  const top = anchor.y + anchor.height + 8;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
        <View style={[styles.menu, { top, left: Math.max(16, left) }]}>
          {items.map((item, index) => (
            <Pressable
              key={item.id}
              style={[styles.row, index < items.length - 1 && styles.rowBorder]}
              accessibilityRole="button"
              onPress={() => {
                onSelect?.(item);
                onClose();
              }}>
              <Text style={styles.label}>{item.label}</Text>
              <Ionicons name={item.icon} size={22} color="#111827" />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  menu: {
    position: 'absolute',
    width: MENU_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});
