import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBackFromOrigin } from '@/lib/navigation';

export const NAVY = '#1A1A4E';

type CreditoFlowHeaderProps = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function CreditoFlowHeader({
  title,
  onBack,
  right,
  icon,
}: CreditoFlowHeaderProps) {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top + 12 },
        icon ? styles.headerExpanded : null,
      ]}>
      <View style={styles.headerPattern} />
      <View style={styles.headerContent}>
        <Pressable
          style={styles.headerBtn}
          accessibilityRole="button"
          onPress={onBack ?? (() => goBackFromOrigin(from))}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        {!icon ? <Text style={styles.headerTitle}>{title}</Text> : <View style={styles.headerSpacer} />}
        {right ?? <View style={styles.headerSpacer} />}
      </View>
      {icon ? (
        <View style={styles.headerCenter}>
          <View style={styles.productIcon}>
            <Ionicons name={icon} size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitleCenter}>{title}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function NavyPatternOverlay() {
  return <View style={styles.headerPattern} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerExpanded: {
    paddingBottom: 28,
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerCenter: {
    marginTop: 16,
    alignItems: 'center',
  },
  productIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleCenter: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
