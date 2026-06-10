import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardFlowPrimaryButton, CardFlowShell } from '@/components/cards/CardFlowShell';

const PREPAID_ASSET = require('../../assets/images/cartao.png');

const PREPAID_BENEFITS = [
  {
    id: 'control',
    icon: 'wallet-outline' as const,
    title: 'Controlo total do saldo',
    description: 'Só gasta o que carregar na conta. Sem surpresas no fim do mês.',
  },
  {
    id: 'instant',
    icon: 'flash-outline' as const,
    title: 'Ativação imediata',
    description: 'Cartão virtual disponível logo após a confirmação.',
  },
  {
    id: 'security',
    icon: 'shield-checkmark-outline' as const,
    title: 'Segurança Mastercard',
    description: 'Congele ou substitua o cartão a qualquer momento na app.',
  },
];

export default function PrepaidCardIntroScreen() {
  const insets = useSafeAreaInsets();

  return (
    <CardFlowShell
      title="Cartão Pré-pago"
      footer={
        <CardFlowPrimaryButton
          label="Ativar cartão pré-pago"
          hint="Sem custos de abertura"
          onPress={() => router.replace('/(tabs)/cards')}
        />
      }>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 120 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.previewWrap}>
          <Image
            source={PREPAID_ASSET}
            style={styles.preview}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>Pré-pago</Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Mastercard Pré-pago</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sem anuidade</Text>
          </View>
        </View>

        <View style={styles.benefits}>
          {PREPAID_BENEFITS.map((benefit) => (
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
  previewWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  preview: {
    width: 320,
    height: 320 * (180 / 329),
  },
  typeBadge: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
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
