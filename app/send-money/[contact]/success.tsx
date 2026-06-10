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
  SendMoneyPrimaryButton,
  SendMoneyShell,
} from '@/components/send-money/SendMoneyShell';
import { ShareTransferReceiptButton } from '@/components/transfer/ShareTransferReceiptButton';
import { getContactById } from '@/constants/contacts';
import { formatMoneyShortFromDigitsAsCents } from '@/lib/money';
import {
  buildContactTransferReceipt,
} from '@/lib/transfer-receipt';

export default function SendMoneySuccessScreen() {
  const { contact: contactId, amount } = useLocalSearchParams<{
    contact?: string;
    amount?: string;
  }>();
  const contact = useMemo(
    () => getContactById(typeof contactId === 'string' ? contactId : '') ?? getContactById('ruben-troso')!,
    [contactId]
  );
  const amountDigits = typeof amount === 'string' ? amount : '';
  const amountShort = formatMoneyShortFromDigitsAsCents(amountDigits);
  const generatedAt = useMemo(() => new Date(), []);
  const receipt = useMemo(
    () => buildContactTransferReceipt(contact, amountDigits, generatedAt),
    [contact, amountDigits, generatedAt],
  );

  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(16);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 14, stiffness: 140 });
    circleOpacity.value = withTiming(1, { duration: 280 });
    checkScale.value = withDelay(220, withSpring(1, { damping: 11, stiffness: 180 }));
    checkOpacity.value = withDelay(220, withTiming(1, { duration: 200 }));
    textOpacity.value = withDelay(420, withTiming(1, { duration: 350 }));
    textTranslateY.value = withDelay(420, withSpring(0, { damping: 16, stiffness: 120 }));
  }, [checkOpacity, checkScale, circleOpacity, circleScale, textOpacity, textTranslateY]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <SendMoneyShell
      footer={
        <View style={styles.footer}>
          <ShareTransferReceiptButton receipt={receipt} />
          <SendMoneyPrimaryButton
            label="Entendi"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      }>
      <View style={styles.center}>
        <Animated.View style={[styles.checkCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>
        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.title}>Transferência Enviada</Text>
          <Text style={styles.subtitle}>
            {amountShort} enviados para {contact.name}
          </Text>
        </Animated.View>
      </View>
    </SendMoneyShell>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  textBlock: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
});
