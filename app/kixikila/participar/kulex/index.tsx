import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import {
  getKixikilaStatusLabel,
  type PlatformKixikilaSummary,
} from '@/constants/kixikila';
import { useKixikilaData } from '@/hooks/useKixikilaData';

export default function KixikilaKulexListScreen() {
  const { platformKixikilas, isJoinedPlatform } = useKixikilaData();

  return (
    <AddMoneyShell title="Kixikila Kulex">
      <Text style={styles.hint}>
        Grupos criados pela Kulex. Participa sem ver os nomes reais dos outros membros.
      </Text>

      <View style={styles.list}>
        {platformKixikilas.map((item) => (
          <PlatformKixikilaRow
            key={item.id}
            item={item}
            joined={isJoinedPlatform(item.id)}
          />
        ))}
      </View>
    </AddMoneyShell>
  );
}

function PlatformKixikilaRow({
  item,
  joined,
}: {
  item: PlatformKixikilaSummary;
  joined: boolean;
}) {
  const statusLabel = getKixikilaStatusLabel(item.status, item.members, item.memberCapacity);

  const handlePress = () => {
    if (joined) {
      router.push({
        pathname: '/kixikila/[id]',
        params: { id: item.id },
      });
      return;
    }

    router.push({
      pathname: '/kixikila/participar/kulex/[id]',
      params: { id: item.id },
    } as never);
  };

  return (
    <Pressable
      style={styles.row}
      accessibilityRole="button"
      onPress={handlePress}>
      <View style={styles.rowIcon}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowMeta}>
          {item.members}/{item.memberCapacity} membros · {statusLabel}
        </Text>
        <Text style={styles.rowMeta}>
          {item.amountPerMember}/membro · {item.frequency}
        </Text>
        {joined ? (
          <Text style={styles.joinedBadge}>Já participas</Text>
        ) : (
          <Text style={styles.anonymousBadge}>Participantes anónimos</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.45)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 19,
  },
  list: {
    marginTop: 20,
    gap: 10,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rowMeta: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 16,
  },
  anonymousBadge: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },
  joinedBadge: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: '700',
    color: '#A7F3D0',
  },
});
