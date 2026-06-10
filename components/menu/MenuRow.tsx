import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  title: string;
  subtitle?: string;
  icon: IoniconName;
  iconBg?: string;
  iconColor?: string;
  destructive?: boolean;
  showChevron?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  last?: boolean;
};

export function MenuRow({
  title,
  subtitle,
  icon,
  iconBg = '#EEF0F8',
  iconColor = '#1A1A4E',
  destructive = false,
  showChevron = true,
  toggleValue,
  onToggle,
  onPress,
  last = false,
}: Props) {
  const isToggle = typeof toggleValue === 'boolean';

  return (
    <Pressable
      style={[styles.row, last && styles.rowLast]}
      accessibilityRole={isToggle ? 'switch' : 'button'}
      disabled={isToggle}
      onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.title, destructive && styles.titleDestructive]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#D1D5DB', true: '#C9A227' }}
          thumbColor="#FFFFFF"
        />
      ) : showChevron ? (
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  titleDestructive: {
    color: '#DC2626',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 16,
  },
});
