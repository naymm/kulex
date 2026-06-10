import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { ShareTransferReceiptButton } from '@/components/transfer/ShareTransferReceiptButton';
import { parseKwikParams } from '@/lib/kwik';
import {
  buildKwikTransferReceipt,
} from '@/lib/transfer-receipt';

export default function KwikTransferSuccessScreen() {
  const params = parseKwikParams(useLocalSearchParams());
  const generatedAt = useMemo(() => new Date(), []);
  const receipt = useMemo(
    () => buildKwikTransferReceipt(params, generatedAt),
    [params, generatedAt],
  );
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(16);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 14, stiffness: 140 });
    circleOpacity.value = withTiming(1, { duration: 280 });
    checkScale.value = withDelay(220, withSpring(1, { damping: 11, stiffness: 180 }));
    checkOpacity.value = withDelay(220, withTiming(1, { duration: 200 }));
    contentOpacity.value = withDelay(420, withTiming(1, { duration: 350 }));
    contentTranslateY.value = withDelay(420, withSpring(0, { damping: 16, stiffness: 120 }));
  }, [checkOpacity, checkScale, circleOpacity, circleScale, contentOpacity, contentTranslateY]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <AddMoneyShell
      hideHeader
      footer={
        <View style={styles.footer}>
          <ShareTransferReceiptButton receipt={receipt} />
          <AddMoneyPrimaryButton label="Entendi" onPress={() => router.replace('/(tabs)')} />
        </View>
      }>
      <View style={styles.center}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={contentStyle}>
          <Text style={styles.title}>
            Transferência efectuada{'\n'}com sucesso
          </Text>
        </Animated.View>
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
  },
});
