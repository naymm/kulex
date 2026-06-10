import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAgentNotifications, markNotificationRead } from '@/lib/agent';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

export default function AgentAprovarScreen() {
  const insets = useSafeAreaInsets();
  const { type, id } = useLocalSearchParams<{ type?: string; id?: string }>();
  const notification = getAgentNotifications().find((item) => item.id === id);

  const isActivation = type === 'activation';
  const title = isActivation ? 'Validar activação' : 'Confirmar levantamento';

  const approve = () => {
    if (id) markNotificationRead(id);
    router.replace('/(tabs)');
  };

  const reject = () => {
    if (id) markNotificationRead(id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backBtn}
            accessibilityRole="button"
            onPress={() => goBackFromOrigin(undefined, () => router.back())}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons
            name={isActivation ? 'person-add-outline' : 'arrow-up-circle-outline'}
            size={36}
            color={NAVY}
          />
        </View>
        <Text style={styles.clientName}>{notification?.clientName ?? 'Cliente'}</Text>
        <Text style={styles.message}>{notification?.message}</Text>
        {notification?.amount ? (
          <Text style={styles.amount}>{notification.amount}</Text>
        ) : null}

        <Pressable style={styles.approveBtn} accessibilityRole="button" onPress={approve}>
          <Text style={styles.approveBtnText}>
            {isActivation ? 'Aprovar activação' : 'Confirmar levantamento'}
          </Text>
        </Pressable>

        <Pressable style={styles.rejectBtn} accessibilityRole="button" onPress={reject}>
          <Text style={styles.rejectBtnText}>Recusar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  clientName: { fontSize: 22, fontWeight: '800', color: '#111827' },
  message: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  amount: { marginTop: 14, fontSize: 28, fontWeight: '800', color: NAVY },
  approveBtn: {
    marginTop: 32,
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  rejectBtn: {
    marginTop: 12,
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtnText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },
});
