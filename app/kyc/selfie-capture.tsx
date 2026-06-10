import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function KycSelfieCapture() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  const take = async () => {
    if (busy || !cameraRef.current) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: true,
      });
      if (photo?.uri) {
        router.replace({ pathname: '/kyc/selfie-review', params: { selfieUri: photo.uri } });
      }
    } finally {
      setBusy(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionWrap}>
        <Text style={styles.permissionTitle}>Permissão de câmera necessária</Text>
        <Pressable style={styles.permissionBtn} onPress={() => requestPermission()}>
          <Text style={styles.permissionBtnText}>Permitir</Text>
        </Pressable>
        <Pressable style={styles.permissionBack} onPress={() => router.back()}>
          <Text style={styles.permissionBackText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        key="front"
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="front"
      />
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 28) }]}>
        <Pressable
          style={[styles.shutter, busy && styles.shutterDisabled]}
          onPress={take}
          accessibilityRole="button"
        >
          <View style={styles.shutterInner} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  topBar: { paddingHorizontal: 16 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  shutter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterDisabled: { opacity: 0.6 },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
  },
  permissionWrap: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  permissionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  permissionBtn: {
    marginTop: 16,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionBtnText: { color: '#111827', fontWeight: '800' },
  permissionBack: { marginTop: 14 },
  permissionBackText: { color: '#9CA3AF', fontWeight: '600' },
});
