import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAVY = '#1A1A4E';

export default function KycSelfieIntro() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#111827" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 18) + 88 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Agora é hora de tirar uma selfie</Text>
        <Text style={styles.subtitle}>
          Vamos compará-la com a foto do seu documento de identidade para garantir
          que é você mesmo.
        </Text>

        <Text style={styles.tipsHeading}>Dicas para uma selfie de sucesso:</Text>

        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>
            Certifique-se de que você está em um lugar com uma conexão de internet
            estável.
          </Text>
        </View>
        <View style={[styles.bulletRow, { marginTop: 10 }]}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>
            Segure o seu dispositivo na vertical para garantir que a câmera grave
            no modo retrato.
          </Text>
        </View>

        <View style={styles.alertBox}>
          <View style={styles.alertIcon}>
            <Ionicons name="alert" size={18} color="#111827" />
          </View>
          <Text style={styles.alertText}>
            <Text style={styles.alertBold}>Fique na página. </Text>
            Não mude de aba ou de aplicativo até que a sua selfie seja enviada,
            mesmo que demore um pouco mais. Caso contrário, você terá que começar
            de novo.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <Pressable
          style={styles.cta}
          accessibilityRole="button"
          onPress={() => router.push('/kyc/selfie-capture')}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 22 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 20 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    fontWeight: '500',
  },
  tipsHeading: {
    marginTop: 28,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bullet: {
    width: 18,
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
    fontWeight: '500',
  },
  alertBox: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FACC15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
    fontWeight: '500',
  },
  alertBold: { fontWeight: '800', color: '#111827' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
