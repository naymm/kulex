import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatAgentPhone, getAgentClients, getClientInitials } from '@/lib/agent-clients';

const NAVY = '#1A1A4E';

export default function AgentClientesTabScreen() {
  const insets = useSafeAreaInsets();
  const clients = getAgentClients();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Clientes</Text>
            <Text style={styles.headerSubtitle}>
              {clients.length} {clients.length === 1 ? 'cliente activo' : 'clientes activos'}
            </Text>
          </View>
          <Pressable
            style={styles.addBtn}
            accessibilityRole="button"
            accessibilityLabel="Adicionar novo cliente"
            onPress={() => router.push('/agent/activar-cliente')}>
            <Ionicons name="person-add-outline" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        {clients.map((client) => (
          <Pressable
            key={client.phone}
            style={styles.clientRow}
            accessibilityRole="button"
            onPress={() => router.push(`/agent/clientes/${client.phone}`)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getClientInitials(client.name)}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientPhone}>{formatAgentPhone(client.phone)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: 18, paddingTop: 8, gap: 10, marginTop: 20 },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: NAVY,
  },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  clientPhone: { marginTop: 3, fontSize: 13, fontWeight: '500', color: '#6B7280' },
});
