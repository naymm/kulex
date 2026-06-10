import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAVY = '#1A1A4E';
export const SIGNUP_HORIZONTAL_PADDING = 28;

export function signupPageInsets(insets: { top: number; bottom: number }) {
  return {
    paddingTop: insets.top + 12,
    paddingBottom: insets.bottom + 20,
  };
}

export const signupPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIGNUP_HORIZONTAL_PADDING,
  },
  inner: { flex: 1 },
  title: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
  },
});

type SignupShellProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  buttonLabel?: string;
  onContinue?: () => void;
  scrollable?: boolean;
  contentStyle?: object;
};

export function SignupBackButton() {
  return (
    <Pressable
      style={styles.backBtn}
      accessibilityRole="button"
      onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={18} color="#111827" />
    </Pressable>
  );
}

export function SignupShell({
  title,
  subtitle,
  children,
  footer,
  buttonLabel,
  onContinue,
  scrollable = false,
  contentStyle,
}: SignupShellProps) {
  const insets = useSafeAreaInsets();

  const body = (
    <>
      <SignupBackButton />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={[styles.body, contentStyle]}>{children}</View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {scrollable ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            signupPageInsets(insets),
          ]}
          showsVerticalScrollIndicator={false}>
          {body}
          {footer}
          {buttonLabel && onContinue ? (
            <Pressable style={styles.cta} accessibilityRole="button" onPress={onContinue}>
              <Text style={styles.ctaText}>{buttonLabel}</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      ) : (
        <View style={[styles.page, signupPageInsets(insets)]}>
          <View style={styles.pageInner}>{body}</View>
          {footer}
          {buttonLabel && onContinue ? (
            <Pressable style={styles.cta} accessibilityRole="button" onPress={onContinue}>
              <Text style={styles.ctaText}>{buttonLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

export const signupStyles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  sectionGap: {
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  page: { flex: 1, paddingHorizontal: SIGNUP_HORIZONTAL_PADDING },
  pageInner: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: SIGNUP_HORIZONTAL_PADDING },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    fontWeight: '400',
  },
  body: { marginTop: 28, flex: 1 },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  ctaText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
