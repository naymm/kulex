import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AddMoneyShell } from '@/components/add-money/AddMoneyShell';

const OPTIONS = [
  {
    id: 'convite',
    title: 'Convite',
    description: 'Participa numa Kixikila com o código enviado pelo organizador.',
    icon: 'ticket-outline' as const,
    route: '/kixikila/participar/convite',
  },
  {
    id: 'kulex',
    title: 'Kixikila Kulex',
    description: 'Explora os grupos criados pela app com participantes anónimos.',
    icon: 'shield-checkmark-outline' as const,
    route: '/kixikila/participar/kulex',
  },
] as const;

export default function ParticiparKixikilaScreen() {
  return (
    <AddMoneyShell title="Participar Kixikila">
      <Text style={styles.hint}>Escolhe como queres entrar numa Kixikila.</Text>

      <View style={styles.options}>
        {OPTIONS.map((option, index) => (
          <Pressable
            key={option.id}
            style={[styles.optionCard, index === OPTIONS.length - 1 && styles.optionCardLast]}
            accessibilityRole="button"
            onPress={() => router.push(option.route as never)}>
            <View style={styles.optionIcon}>
              <Ionicons name={option.icon} size={22} color="#FFFFFF" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.45)" />
          </Pressable>
        ))}
      </View>
    </AddMoneyShell>
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
  options: {
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    overflow: 'hidden',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  optionCardLast: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  optionDescription: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 17,
  },
});
