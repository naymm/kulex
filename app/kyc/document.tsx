import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function KycDocument() {
  const insets = useSafeAreaInsets();
  const top = useMemo(() => insets.top + 12, [insets.top]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#111827" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Verifique a sua identidade{'\n'}com o seu bilhete de{'\n'}identidade
        </Text>

        <View style={styles.centerIconWrap}>
          <View style={styles.centerIconCircle}>
            <Ionicons name="card-outline" size={42} color="#111827" />
          </View>
        </View>

        <Text style={styles.description}>
          Pegue o seu bilhete de identidade, precisarás{'\n'}para fotografia.
        </Text>

        <View style={styles.securityRow}>
          <Ionicons name="lock-closed-outline" size={18} color="#111827" />
          <Text style={styles.securityText}>Dados são processados com segurança</Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <Pressable
          style={styles.cta}
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/kyc/capture/[side]',
              params: { side: 'front' },
            })
          }
        >
          <Text style={styles.ctaText}>Fotografar</Text>
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
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 18 },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 34,
  },
  centerIconWrap: {
    alignItems: 'center',
    marginTop: 52,
  },
  centerIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginTop: 46,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  securityText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  footer: { paddingHorizontal: 22, paddingTop: 18 },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

