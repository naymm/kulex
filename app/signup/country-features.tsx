import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SignupBackButton, signupPageInsets, signupPageStyles } from '@/components/signup/SignupShell';
import { COUNTRY_FEATURES } from '@/constants/signup';
import { flagEmojiFromIso2 } from '@/constants/countries';
import { useSignup } from '@/contexts/signup-context';

export default function SignupCountryFeaturesScreen() {
  const insets = useSafeAreaInsets();
  const { country } = useSignup();

  return (
    <View style={[signupPageStyles.container, { paddingTop: insets.top + 12 }]}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 88,
        }}
        showsVerticalScrollIndicator={false}>
        <SignupBackButton />
        <View style={styles.flagCircle}>
          <Text style={styles.flagEmoji}>{flagEmojiFromIso2(country.code)}</Text>
        </View>
        <Text style={styles.title}>O que você pode fazer com a Kulex em {country.name}</Text>
        <Text style={styles.subtitle}>
          A forma como você pode usar a Kulex depende do seu país ou região.
        </Text>

        <View style={styles.features}>
          {COUNTRY_FEATURES.map((f) => (
            <View key={f.id} style={styles.featureRow}>
              <View style={styles.iconWrap}>
                <Ionicons name={f.icon} size={22} color="#374151" />
                <View style={styles.badge}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          style={styles.cta}
          accessibilityRole="button"
          onPress={() => router.push('/signup/phone')}>
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flagCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  flagEmoji: { fontSize: 36 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
  },
  features: { marginTop: 32, gap: 28 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  featureDesc: { marginTop: 4, fontSize: 13, lineHeight: 18, color: '#6B7280' },
  footer: { paddingTop: 12 },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
