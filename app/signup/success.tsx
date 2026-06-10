import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KulexLogo } from '@/components/KulexLogo';
import { SIGNUP_HORIZONTAL_PADDING } from '@/components/signup/SignupShell';
import {
  SIGNUP_WELCOME_FEATURES,
  SIGNUP_WELCOME_PRIVACY,
} from '@/constants/signup-welcome';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';
const SPLASH_MS = 900;
const WELCOME_MS = 1900;

const APP_ICON = require('../../assets/images/icon.png');

export default function SignupSuccessScreen() {
  const insets = useSafeAreaInsets();
  const [showWelcome, setShowWelcome] = useState(false);
  const splashProgress = useSharedValue(0);
  const welcomeProgress = useSharedValue(0);

  useEffect(() => {
    splashProgress.value = withTiming(1, {
      duration: SPLASH_MS,
      easing: Easing.out(Easing.cubic),
    });

    const phaseTimer = setTimeout(() => {
      setShowWelcome(true);
      welcomeProgress.value = withTiming(1, {
        duration: WELCOME_MS,
        easing: Easing.inOut(Easing.cubic),
      });
    }, SPLASH_MS);

    return () => clearTimeout(phaseTimer);
  }, [splashProgress, welcomeProgress]);

  const splashLogoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(splashProgress.value, [0, 0.15, 0.85, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(splashProgress.value, [0, 0.2, 1], [0.86, 1, 0.92], Extrapolation.CLAMP) },
      { translateY: interpolate(splashProgress.value, [0, 0.2, 1], [20, 0, -8], Extrapolation.CLAMP) },
    ],
  }));

  const splashTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(splashProgress.value, [0.1, 0.25, 0.8, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(splashProgress.value, [0.1, 0.25, 1], [16, 0, -6], Extrapolation.CLAMP) },
    ],
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(splashProgress.value, [0.15, 0.3, 0.85, 1], [0, 1, 1, 0], Extrapolation.CLAMP),
  }));

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(welcomeProgress.value, [0, 0.18], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(welcomeProgress.value, [0, 0.18], [24, 0], Extrapolation.CLAMP) },
    ],
  }));

  const privacyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(welcomeProgress.value, [0.68, 0.82], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(welcomeProgress.value, [0.68, 0.82], [14, 0], Extrapolation.CLAMP) },
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(welcomeProgress.value, [0.76, 0.9], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(welcomeProgress.value, [0.76, 0.9], [18, 0], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <LinearGradient
      colors={['#040306', '#131624']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />

      {!showWelcome ? (
        <View style={[styles.splashScreen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.splashCenter}>
            <Animated.View style={splashLogoStyle}>
              <View style={styles.iconWrap}>
                <Image source={APP_ICON} style={styles.icon} resizeMode="cover" />
              </View>
            </Animated.View>

            <Animated.View style={[styles.splashTitle, splashTitleStyle]}>
              <Text style={styles.splashWelcome}>Bem-vindo à</Text>
              <View style={styles.logoWrap}>
                <KulexLogo height={40} color={GOLD} />
              </View>
            </Animated.View>
          </View>

          <Animated.View style={[styles.spinnerWrap, spinnerStyle]}>
            <ActivityIndicator color="#FFFFFF" />
          </Animated.View>
        </View>
      ) : (
        <>
          <View
            style={[
              styles.content,
              {
                paddingTop: insets.top + 20,
                paddingBottom: Math.max(insets.bottom, 20) + 12,
              },
            ]}>
            <Animated.View style={[styles.header, headerStyle]}>
              <Text style={styles.headerWelcome}>Bem-vindo à</Text>
              <View style={styles.logoWrap}>
                <KulexLogo height={40} color={GOLD} />
              </View>
            </Animated.View>

            <View style={styles.features}>
              {SIGNUP_WELCOME_FEATURES.map((feature, index) => (
                <WelcomeFeatureRow
                  key={feature.id}
                  feature={feature}
                  index={index}
                  progress={welcomeProgress}
                />
              ))}
            </View>

            <Animated.View style={[styles.privacyWrap, privacyStyle]}>
              <Ionicons name="people-outline" size={22} color={GOLD} style={styles.privacyIcon} />
              <Text style={styles.privacyText}>{SIGNUP_WELCOME_PRIVACY}</Text>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 20) },
              buttonStyle,
            ]}>
            <Pressable
              style={styles.cta}
              accessibilityRole="button"
              onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.ctaText}>Continue</Text>
            </Pressable>
          </Animated.View>
        </>
      )}
    </LinearGradient>
  );
}

function WelcomeFeatureRow({
  feature,
  index,
  progress,
}: {
  feature: (typeof SIGNUP_WELCOME_FEATURES)[number];
  index: number;
  progress: SharedValue<number>;
}) {
  const start = 0.2 + index * 0.1;
  const end = start + 0.12;

  const rowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [start, end], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(progress.value, [start, end], [28, 0], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <Animated.View style={[styles.featureRow, rowStyle]}>
      <View style={styles.featureIconWrap}>
        <Ionicons name={feature.icon} size={22} color={GOLD} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashScreen: {
    flex: 1,
    paddingHorizontal: SIGNUP_HORIZONTAL_PADDING,
  },
  splashCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 112,
    height: 112,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#0d1020',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  splashTitle: {
    marginTop: 28,
    alignItems: 'center',
  },
  splashWelcome: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  logoWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  spinnerWrap: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIGNUP_HORIZONTAL_PADDING,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  headerWelcome: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  features: {
    gap: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIconWrap: {
    width: 34,
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.72)',
  },
  privacyWrap: {
    marginTop: 'auto',
    paddingTop: 28,
    alignItems: 'center',
  },
  privacyIcon: {
    marginBottom: 10,
  },
  privacyText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.55)',
  },
  footer: {
    paddingHorizontal: SIGNUP_HORIZONTAL_PADDING,
    paddingTop: 12,
  },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});