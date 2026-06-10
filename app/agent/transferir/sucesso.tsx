import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AGENT_COMMISSION_BALANCE } from '@/constants/agent';

const NAVY = '#1A1A4E';

export default function AgentTransferirSucessoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={72} color="#16A34A" />
      </View>
      <Text style={styles.title}>Transferência concluída</Text>
      <Text style={styles.subtitle}>
        {AGENT_COMMISSION_BALANCE} transferidos para a sua conta pessoal.
      </Text>

      <Pressable
        style={styles.primaryBtn}
        accessibilityRole="button"
        onPress={() => router.dismissTo('/(tabs)')}>
        <Text style={styles.primaryBtnText}>Voltar ao início</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827' },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  primaryBtn: {
    marginTop: 36,
    height: 54,
    borderRadius: 27,
    backgroundColor: NAVY,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
