import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import type { TransferReceiptData } from '@/lib/transfer-receipt';
import { shareTransferReceiptPdf } from '@/lib/transfer-receipt';

type ShareTransferReceiptButtonProps = {
  receipt: TransferReceiptData;
};

export function ShareTransferReceiptButton({ receipt }: ShareTransferReceiptButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await shareTransferReceiptPdf(receipt);
    } catch {
      Alert.alert('Erro', 'Não foi possível gerar o comprovante. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={[styles.button, loading && styles.buttonDisabled]}
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
      disabled={loading}
      onPress={handlePress}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
      )}
      <Text style={styles.buttonText}>Gerar comprovante e partilhar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
