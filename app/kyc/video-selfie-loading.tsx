import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function KycVideoSelfieLoading() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/kyc/video-selfie-done');
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.iconCircle}>
        <Text style={styles.dollar}>$</Text>
      </View>
      <Text style={styles.title}>
        Enviando a sua vídeo-selfie{'\n'}de forma segura
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  dollar: { fontSize: 30, fontWeight: '900', color: '#166534' },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 24,
  },
});

