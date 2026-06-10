import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InvoiceCreateForm } from '@/components/business/InvoiceCreateForm';
import type { InvoiceType } from '@/constants/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

export default function BusinessCriarFacturaScreen() {
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const initialType: InvoiceType = type === 'simplified' ? 'simplified' : 'normal';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => goBackFromOrigin(undefined, () => router.back())}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Criar nova factura</Text>
        <View style={styles.headerSpacer} />
      </View>

      <InvoiceCreateForm
        initialType={initialType}
        onPreview={(draft) =>
          router.push({
            pathname: '/business/facturacao/preview',
            params: {
              payload: JSON.stringify({
                ...draft,
                dueDate: draft.dueDate?.toISOString() ?? null,
              }),
            },
          })
        }
        onSaveDraft={() =>
          Alert.alert('Rascunho guardado', 'A factura foi salva como rascunho.')
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: NAVY,
  },
  headerSpacer: { width: 40 },
});
