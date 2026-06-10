import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Side = 'front' | 'back';

function titleFor(side: Side) {
  return side === 'front'
    ? 'Parte frontal do Bilhete de Identidade'
    : 'Parte de trás do Bilhete de Identidade';
}

export default function KycCapture() {
  const insets = useSafeAreaInsets();
  const { side, frontUri, backUri } = useLocalSearchParams<{
    side?: string;
    frontUri?: string;
    backUri?: string;
  }>();
  const s: Side = side === 'back' ? 'back' : 'front';

  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  const title = useMemo(() => titleFor(s), [s]);

  const take = async () => {
    if (busy) return;
    if (!cameraRef.current) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });
      const uri = photo?.uri as string | undefined;
      if (!uri) return;

      if (s === 'front') {
        router.replace({
          pathname: '/kyc/capture/[side]',
          params: { side: 'back', frontUri: uri, backUri: typeof backUri === 'string' ? backUri : undefined },
        });
      } else {
        router.replace({
          pathname: '/kyc/review',
          params: {
            frontUri: typeof frontUri === 'string' ? frontUri : undefined,
            backUri: uri,
          },
        });
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
        <Pressable style={styles.permissionBtn} onPress={requestPermission}>
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
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.frameWrap} pointerEvents="none">
        <View style={styles.frame} />
      </View>

      <View style={styles.bottom}>
        <View style={styles.infoIcon}>
          <Ionicons name="card-outline" size={26} color="#FFFFFF" />
        </View>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>
          Certifique-se de que todos os detalhes estejam{'\n'}claros e que todo o BI
          se encaixe na caixa acima.
        </Text>

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
  frame: {
    width: 324,
    height: 203,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  frameWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '28%',
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingBottom: 36,
    alignItems: 'center',
  },
  infoIcon: { marginBottom: 6 },
  infoTitle: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoText: {
    color: '#E5E7EB',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 26,
    fontWeight: '500',
  },
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

