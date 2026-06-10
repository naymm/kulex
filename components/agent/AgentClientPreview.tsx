import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { formatAgentPhone } from '@/lib/agent-clients';

const NAVY = '#1A1A4E';

type Props = {
  phone: string;
  name: string;
  variant?: 'card' | 'compact';
};

export function AgentClientPreview({ phone, name, variant = 'card' }: Props) {
  if (variant === 'compact') {
    return (
      <View style={styles.compact}>
        <View style={styles.compactIcon}>
          <Ionicons name="person" size={18} color={NAVY} />
        </View>
        <View style={styles.compactText}>
          <Text style={styles.compactName}>{name}</Text>
          <Text style={styles.compactPhone}>{formatAgentPhone(phone)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>{formatAgentPhone(phone)}</Text>
      </View>
      <View style={styles.verifiedBadge}>
        <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  phone: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
  },
  verifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(22,163,74,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  compactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactText: {
    flex: 1,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  compactPhone: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
});
