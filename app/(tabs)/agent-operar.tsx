import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AGENT_OPERATION_ACTIONS } from '@/constants/agent';

const NAVY = '#1A1A4E';

export default function AgentOperarTabScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Nova operação</Text>
        <Text style={styles.headerSubtitle}>Escolha o tipo de operação cash para o cliente</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {AGENT_OPERATION_ACTIONS.map((action) => (
            <Pressable
              key={action.id}
              style={styles.tile}
              accessibilityRole="button"
              onPress={() => router.push(action.href as never)}>
              <View style={[styles.iconWrap, { backgroundColor: action.iconBg }]}>
                <Ionicons name={action.icon} size={26} color={action.iconColor} />
              </View>
              <Text style={styles.tileTitle}>{action.title}</Text>
              <Text style={styles.tileSubtitle}>{action.subtitle}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.historyBtn}
          accessibilityRole="button"
          onPress={() => router.push('/agent/historico')}>
          <Ionicons name="time-outline" size={22} color={NAVY} />
          <View style={styles.historyText}>
            <Text style={styles.historyTitle}>Histórico detalhado</Text>
            <Text style={styles.historySubtitle}>Activação, cash-in, cash-out e cartões</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>
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
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: 18, paddingTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tileTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  tileSubtitle: { marginTop: 4, fontSize: 12, fontWeight: '500', color: '#6B7280' },
  historyBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyText: { flex: 1 },
  historyTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  historySubtitle: { marginTop: 3, fontSize: 12, fontWeight: '500', color: '#6B7280' },
});
