import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardFlowPrimaryButton, CardFlowShell } from '@/components/cards/CardFlowShell';
import { PostpaidCardPreview } from '@/components/cards/PostpaidCardPreview';
import { POSTPAID_CARD_BENEFITS } from '@/constants/postpaid-card';

export default function PostpaidCardIntroScreen() {
  const insets = useSafeAreaInsets();

  return (
    <CardFlowShell
      footer={
        <CardFlowPrimaryButton
          label="Solicitar cartão pós-pago"
          hint="Verificação de elegibilidade incluída"
          onPress={() => router.push('/cards/pos-pago/elegibilidade')}
        />
      }>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 120 },
        ]}
        showsVerticalScrollIndicator={false}>
        <PostpaidCardPreview width={320} />

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Mastercard Pós-pago</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sem anuidade</Text>
          </View>
        </View>

        <View style={styles.benefits}>
          {POSTPAID_CARD_BENEFITS.map((benefit) => (
            <View key={benefit.id} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Ionicons name={benefit.icon} size={20} color="#1A1A4E" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </CardFlowShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: 'center',
  },
  titleBlock: {
    marginTop: 28,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  benefits: {
    width: '100%',
    marginTop: 28,
    gap: 22,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  benefitIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  benefitDescription: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
  },
  benefitText: {
    flex: 1,
  },
});
