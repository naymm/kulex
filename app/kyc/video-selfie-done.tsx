import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAVY = '#1A1A4E';

export default function KycVideoSelfieDone() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <View style={styles.clockWrap}>
          <View style={styles.clockCircle} />
          <View style={styles.clockHand} />
          <View style={styles.rays}>
            {Array.from({ length: 12 }).map((_, i) => (
              <View
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                style={[
                  styles.ray,
                  { transform: [{ rotate: `${i * 30}deg` }, { translateY: -58 }] },
                  i % 3 === 0 ? styles.rayDark : i % 4 === 0 ? styles.rayGreen : styles.rayLight,
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.title}>
          ESTAMOS VERIFICANDO{'\n'}AS SUAS{'\n'}INFORMAÇÕES
        </Text>
        <Text style={styles.subtitle}>
          Você poderá usar a sua conta assim que{'\n'}este processo for concluído.
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <Pressable
          style={styles.cta}
          accessibilityRole="button"
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.ctaText}>Entendi</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 22 },
  clockWrap: { width: 150, height: 150, marginBottom: 22 },
  rays: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  ray: {
    position: 'absolute',
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#111827',
  },
  rayDark: { backgroundColor: '#111827' },
  rayGreen: { backgroundColor: '#166534' },
  rayLight: { backgroundColor: '#D1D5DB' },
  clockCircle: {
    position: 'absolute',
    left: 40,
    top: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#111827',
  },
  clockHand: {
    position: 'absolute',
    left: 75,
    top: 52,
    width: 3,
    height: 34,
    borderRadius: 2,
    backgroundColor: '#111827',
    transform: [{ rotate: '10deg' }],
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 28,
  },
  subtitle: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  footer: { paddingHorizontal: 22, paddingTop: 18 },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

