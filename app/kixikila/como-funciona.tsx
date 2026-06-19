import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KIXIKILA_FAQ,
  KIXIKILA_FEE_ITEMS,
  KIXIKILA_HOW_IT_WORKS_INTRO,
  KIXIKILA_HOW_IT_WORKS_STEPS,
  KIXIKILA_PARTICIPATION_OPTIONS,
  type KixikilaFaqItem,
  type KixikilaHowItWorksStep,
  type KixikilaParticipationOption,
} from '@/constants/kixikila-how-it-works';

const NAVY = '#1A1A4E';
const HORIZONTAL_PADDING = 20;

export default function KixikilaComoFuncionaScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Como funciona</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>{KIXIKILA_HOW_IT_WORKS_INTRO.title}</Text>
          <Text style={styles.introText}>{KIXIKILA_HOW_IT_WORKS_INTRO.description}</Text>
        </View>

        <SectionTitle>Passo a passo</SectionTitle>
        <View style={styles.card}>
          {KIXIKILA_HOW_IT_WORKS_STEPS.map((step, index) => (
            <StepRow
              key={step.id}
              step={step}
              index={index}
              last={index === KIXIKILA_HOW_IT_WORKS_STEPS.length - 1}
            />
          ))}
        </View>

        <SectionTitle>Formas de participar</SectionTitle>
        <View style={styles.card}>
          {KIXIKILA_PARTICIPATION_OPTIONS.map((option, index) => (
            <ParticipationRow
              key={option.id}
              option={option}
              last={index === KIXIKILA_PARTICIPATION_OPTIONS.length - 1}
              onPress={() => openParticipationOption(option.id)}
            />
          ))}
        </View>

        <SectionTitle>Taxas e comissões</SectionTitle>
        <View style={styles.feeCard}>
          <Text style={styles.feeIntro}>
            Em cada ciclo da Kixikila aplicam-se as seguintes cobranças regulamentadas:
          </Text>
          {KIXIKILA_FEE_ITEMS.map((label) => (
            <View key={label} style={styles.feeRow}>
              <Ionicons name="ellipse" size={6} color={NAVY} />
              <Text style={styles.feeLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <SectionTitle>Perguntas frequentes</SectionTitle>
        <View style={styles.card}>
          {KIXIKILA_FAQ.map((item, index) => (
            <FaqRow key={item.id} item={item} last={index === KIXIKILA_FAQ.length - 1} />
          ))}
        </View>

        <View style={styles.ctaRow}>
          <Pressable
            style={styles.ctaSecondary}
            accessibilityRole="button"
            onPress={() => router.push('/kixikila/participar')}>
            <Text style={styles.ctaSecondaryText}>Participar</Text>
          </Pressable>
          <Pressable
            style={styles.ctaPrimary}
            accessibilityRole="button"
            onPress={() => router.push('/kixikila/criar')}>
            <Text style={styles.ctaPrimaryText}>Criar Kixikila</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function openParticipationOption(id: string) {
  if (id === 'criar') {
    router.push('/kixikila/criar');
    return;
  }
  if (id === 'convite') {
    router.push('/kixikila/participar/convite');
    return;
  }
  if (id === 'kulex') {
    router.push('/kixikila/participar/kulex');
  }
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function StepRow({
  step,
  index,
  last,
}: {
  step: KixikilaHowItWorksStep;
  index: number;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{index + 1}</Text>
      </View>
      <View style={styles.rowIcon}>
        <Ionicons name={step.icon} size={18} color={NAVY} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{step.title}</Text>
        <Text style={styles.rowDescription}>{step.description}</Text>
      </View>
    </View>
  );
}

function ParticipationRow({
  option,
  last,
  onPress,
}: {
  option: KixikilaParticipationOption;
  last?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.row, !last && styles.rowBorder]}
      accessibilityRole="button"
      onPress={onPress}>
      <View style={styles.rowIcon}>
        <Ionicons name={option.icon} size={18} color={NAVY} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{option.title}</Text>
        <Text style={styles.rowDescription}>{option.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </Pressable>
  );
}

function FaqRow({ item, last }: { item: KixikilaFaqItem; last?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      style={[styles.faqRow, !last && styles.rowBorder]}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      onPress={() => setExpanded((value) => !value)}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#6B7280"
        />
      </View>
      {expanded ? <Text style={styles.faqAnswer}>{item.answer}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 20,
  },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  introText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 19,
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  rowDescription: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 17,
  },
  feeCard: {
    backgroundColor: '#EEF0F8',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  feeIntro: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 19,
    marginBottom: 12,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  feeLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: NAVY,
  },
  faqRow: {
    paddingVertical: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
  },
  faqAnswer: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 19,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  ctaSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  ctaSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: NAVY,
  },
  ctaPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
