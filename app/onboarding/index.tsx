import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  cancelAnimation,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ONBOARDING_PROGRESS_SEGMENTS,
  ONBOARDING_SLIDE_DURATION_MS,
  ONBOARDING_SLIDES,
  type OnboardingSlide,
} from '@/constants/onboarding';

const NAVY = '#1A1A4E';

function ProgressSegment({
  index,
  currentStep,
  progress,
}: {
  index: number;
  currentStep: number;
  progress: SharedValue<number>;
}) {
  const fillStyle = useAnimatedStyle(() => {
    if (index < currentStep) {
      return { width: '100%' };
    }
    if (index === currentStep) {
      return { width: `${progress.value * 100}%` };
    }
    return { width: '0%' };
  });

  return (
    <View style={styles.progressSegment}>
      <Animated.View style={[styles.progressFill, fillStyle]} />
    </View>
  );
}

function ProgressBar({
  currentStep,
  progress,
}: {
  currentStep: number;
  progress: SharedValue<number>;
}) {
  return (
    <View style={styles.progressRow}>
      {Array.from({ length: ONBOARDING_PROGRESS_SEGMENTS }, (_, index) => (
        <ProgressSegment key={index} index={index} currentStep={currentStep} progress={progress} />
      ))}
    </View>
  );
}

function OnboardingSlidePage({ slide }: { slide: OnboardingSlide }) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.slide}>
      <Image
        source={slide.background}
        style={[styles.backgroundImage, { width, height }]}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)']}
        locations={[0, 0.45, 1]}
        style={styles.overlay}
      />
      <View style={styles.slideContent}>
        <Text style={styles.title}>{slide.title}</Text>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [step, setStep] = useState(0);
  const progress = useSharedValue(0);
  const currentSlide = ONBOARDING_SLIDES[step];
  const isLast = step === ONBOARDING_SLIDES.length - 1;
  const footerHeight = Math.max(insets.bottom, 24) + 160;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startSlideProgress = useCallback(
    (index: number) => {
      cancelAnimation(progress);
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: ONBOARDING_SLIDE_DURATION_MS,
        easing: Easing.linear,
      });

      clearTimer();

      if (index >= ONBOARDING_SLIDES.length - 1) return;

      timerRef.current = setTimeout(() => {
        setStep(index + 1);
      }, ONBOARDING_SLIDE_DURATION_MS);
    },
    [clearTimer, progress]
  );

  useEffect(() => {
    startSlideProgress(step);
    return clearTimer;
  }, [step, startSlideProgress, clearTimer]);

  const goToLogin = () => {
    router.replace('/login');
  };

  const goToCreateAccount = () => {
    router.push('/signup');
  };

  const goNext = () => {
    if (isLast) return;
    setStep((prev) => prev + 1);
  };

  const goPrevious = () => {
    if (step === 0) return;
    setStep((prev) => prev - 1);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <OnboardingSlidePage slide={currentSlide} />

      <View
        pointerEvents="box-none"
        style={[styles.touchLayer, { top: insets.top + 40, bottom: footerHeight }]}>
        <Pressable
          style={styles.touchZone}
          accessibilityRole="button"
          accessibilityLabel="Slide anterior"
          onPress={goPrevious}
        />
        <Pressable
          style={styles.touchZone}
          accessibilityRole="button"
          accessibilityLabel="Slide seguinte"
          onPress={goNext}
        />
      </View>

      <View pointerEvents="box-none" style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <ProgressBar currentStep={step} progress={progress} />
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        {currentSlide.variant === 'auth' ? (
          <>
            <Pressable
              style={styles.primaryButton}
              accessibilityRole="button"
              onPress={goToCreateAccount}>
              <Text style={styles.primaryButtonText}>Criar Conta</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} accessibilityRole="button" onPress={goToLogin}>
              <Text style={styles.secondaryButtonText}>Iniciar Sessão</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.primaryButton} accessibilityRole="button" onPress={goNext}>
            <Text style={styles.primaryButtonText}>Avançar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  slide: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  slideContent: {
    paddingHorizontal: 32,
    paddingBottom: 180,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  touchLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 1,
  },
  touchZone: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 28,
    gap: 12,
    zIndex: 2,
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});
