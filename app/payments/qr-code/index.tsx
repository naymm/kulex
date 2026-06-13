import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { parseQrPaymentPayload } from '@/lib/qr-payment';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

export default function QrCodePaymentScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      scannedRef.current = false;
    }, []),
  );

  const goBack = () => {
    goBackFromOrigin(from, () => {
      router.dismissTo('/(tabs)/payments');
    });
  };

  const handleBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scannedRef.current) return;

      const payload = parseQrPaymentPayload(data);
      if (!payload?.amountDigits) return;

      scannedRef.current = true;
      router.push({
        pathname: '/payments/qr-code/confirm',
        params: {
          from: from ?? '',
          merchant: payload.merchant,
          amount: payload.amountDigits,
        },
      });
    },
    [from],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} onPress={goBack} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>QR Code</Text>
        </View>
      </View>

      <View style={styles.cameraWrap}>
        {!permission ? (
          <View style={styles.permissionCard}>
            <Text style={styles.permissionText}>A preparar câmara…</Text>
          </View>
        ) : !permission.granted ? (
          <View style={styles.permissionCard}>
            <Ionicons name="camera-outline" size={40} color={NAVY} />
            <Text style={styles.permissionTitle}>Permissão de câmara</Text>
            <Text style={styles.permissionText}>
              Precisamos de acesso à câmara para ler o código QR do comerciante.
            </Text>
            <Pressable style={styles.permissionBtn} onPress={requestPermission} accessibilityRole="button">
              <Text style={styles.permissionBtnText}>Permitir câmara</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={handleBarcodeScanned}
            />
            <View style={styles.overlay}>
              <View style={styles.scanFrame} />
            </View>
          </>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.footerTitle}>Aponte para o QR Code</Text>
        <Text style={styles.footerText}>
          Posicione o código dentro da moldura para pagar no balcão ou em lojas Kulex.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 100,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraWrap: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 240,
    height: 240,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  permissionCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
    backgroundColor: '#F5F6FA',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NAVY,
  },
  permissionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
  },
  permissionBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: NAVY,
  },
  permissionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
});
