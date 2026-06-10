import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAVY = '#1A1A4E';
const GREEN = '#166534';

export default function KycReview() {
  const insets = useSafeAreaInsets();
  const { frontUri, backUri } = useLocalSearchParams<{ frontUri?: string; backUri?: string }>();
  const front = useMemo(() => (typeof frontUri === 'string' ? frontUri : ''), [frontUri]);
  const back = useMemo(() => (typeof backUri === 'string' ? backUri : ''), [backUri]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Está tudo nítido?</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.cardWrap}>
        <View style={styles.card}>
          {front ? <Image source={{ uri: front }} style={styles.img} resizeMode="cover" /> : null}
        </View>
        </View>
        <View style={[styles.cardWrap, { marginTop: 18 }]}>
          <View style={styles.card}>
            {back ? <Image source={{ uri: back }} style={styles.img} resizeMode="cover" /> : null}
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <Pressable
          style={styles.primary}
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/kyc/selfie-intro',
              params: { frontUri: front || undefined, backUri: back || undefined },
            })
          }
        >
          <Text style={styles.primaryText}>Enviar</Text>
        </Pressable>

        <Pressable
          style={[styles.outline, { marginTop: 14 }]}
          accessibilityRole="button"
          onPress={() =>
            router.replace({
              pathname: '/kyc/capture/[side]',
              params: { side: 'front', backUri: back || undefined },
            })
          }
        >
          <Text style={styles.outlineText}>Refazer a parte frontal</Text>
        </Pressable>

        <Pressable
          style={[styles.outline, { marginTop: 12 }]}
          accessibilityRole="button"
          onPress={() =>
            router.replace({
              pathname: '/kyc/capture/[side]',
              params: { side: 'back', frontUri: front || undefined },
            })
          }
        >
          <Text style={styles.outlineText}>Refazer a parte de trás</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 12 },
  cardWrap: { alignItems: 'center' },
  card: {
    width: 324,
    height: 203,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  img: { width: '100%', height: '100%' },
  footer: { paddingHorizontal: 22, paddingTop: 18 },
  primary: {
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  outline: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.6,
    borderColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineText: { color: GREEN, fontSize: 14, fontWeight: '800' },
});

