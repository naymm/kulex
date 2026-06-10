import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CartaoIcon,
  CreditoIcon,
  InicioIcon,
  MenuIcon,
  PagamentosArrowsIcon,
} from '@/components/tab-icons';
import { isAgentAccount } from '@/constants/accounts';
import { AGENT_TAB_ITEMS, PERSONAL_TAB_ITEMS } from '@/constants/tab-bar';
import { useActiveAccount } from '@/contexts/AccountContext';

const INACTIVE_COLOR = '#8E8E8E';
const ACTIVE_COLOR = '#1A1A4E';
const NAVY = '#1A1A4E';
const GOLD = '#C9A227';

type TabBarProps = {
  state: {
    index: number;
    routes: Array<{ key: string; name: string }>;
  };
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented?: boolean };
    navigate: (name: string) => void;
  };
};

function TabIcon({
  routeName,
  focused,
  isAgent,
}: {
  routeName: string;
  focused: boolean;
  isAgent: boolean;
}) {
  const color = focused ? (isAgent && routeName.startsWith('agent-') ? GOLD : ACTIVE_COLOR) : INACTIVE_COLOR;

  if (isAgent) {
    switch (routeName) {
      case 'index':
        return <InicioIcon color={color} />;
      case 'agent-operacoes':
        return <Ionicons name="people-outline" size={24} color={color} />;
      case 'agent-comissoes':
        return <Ionicons name="stats-chart-outline" size={24} color={color} />;
      case 'menu':
        return <Ionicons name="person-circle-outline" size={24} color={color} />;
      default:
        return null;
    }
  }

  switch (routeName) {
    case 'index':
      return <InicioIcon color={color} />;
    case 'cards':
      return <CartaoIcon color={color} />;
    case 'credito':
      return <CreditoIcon color={color} />;
    case 'menu':
      return <MenuIcon color={color} />;
    default:
      return null;
  }
}

function PaymentsCenterTab({
  focused,
  label,
  onPress,
}: {
  focused: boolean;
  label: string;
  onPress: () => void;
}) {
  const rotation = useSharedValue(0);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    rotation.value = withTiming(rotation.value + 360, { duration: 500 });
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.centerTab}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}>
      <View style={styles.fab}>
        <Animated.View style={iconStyle}>
          <PagamentosArrowsIcon />
        </Animated.View>
      </View>
      <Text style={[styles.centerLabel, focused && styles.centerLabelFocused]}>{label}</Text>
    </Pressable>
  );
}

function AgentCenterTab({
  focused,
  label,
  onPress,
}: {
  focused: boolean;
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withTiming(0.9, { duration: 80 }, () => {
      scale.value = withTiming(1, { duration: 120 });
    });
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.centerTab}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}>
      <View style={styles.agentFab}>
        <Animated.View style={iconStyle}>
          <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
        </Animated.View>
      </View>
      <Text style={[styles.centerLabel, focused && styles.agentCenterLabelFocused]}>{label}</Text>
    </Pressable>
  );
}

export function BottomTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { activeAccount } = useActiveAccount();
  const isAgent = isAgentAccount(activeAccount);
  const tabItems = isAgent ? AGENT_TAB_ITEMS : PERSONAL_TAB_ITEMS;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {tabItems.map((item) => {
          const routeIndex = state.routes.findIndex((r) => r.name === item.routeName);
          if (routeIndex === -1) return null;

          const route = state.routes[routeIndex];
          const focused = state.index === routeIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (item.isCenter) {
            if (isAgent) {
              return (
                <AgentCenterTab
                  key={item.routeName}
                  focused={focused}
                  label={item.label}
                  onPress={onPress}
                />
              );
            }

            return (
              <PaymentsCenterTab
                key={item.routeName}
                focused={focused}
                label={item.label}
                onPress={onPress}
              />
            );
          }

          return (
            <Pressable
              key={item.routeName}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={item.label}>
              <View style={styles.iconSlot}>
                <TabIcon routeName={item.routeName} focused={focused} isAgent={isAgent} />
              </View>
              <Text
                style={[
                  styles.label,
                  focused && styles.labelFocused,
                  focused && isAgent && item.routeName.startsWith('agent-') && styles.labelFocusedAgent,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    paddingTop: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    minHeight: 52,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  iconSlot: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '400',
    color: INACTIVE_COLOR,
  },
  labelFocused: {
    color: ACTIVE_COLOR,
    fontWeight: '500',
  },
  labelFocusedAgent: {
    color: GOLD,
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    marginTop: -22,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A1A4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  agentFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C9A227',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  centerLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '500',
    color: '#000000',
  },
  centerLabelFocused: {
    fontWeight: '600',
  },
  agentCenterLabelFocused: {
    fontWeight: '700',
    color: GOLD,
  },
});
