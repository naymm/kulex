import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VIAGEM_INSURANCE_DETAIL } from '@/constants/viagem-insurance';

const NAVY = '#1A1A4E';

export default function ViagemInsuranceDetailScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <View style={styles.heroRow}>
          <View style={styles.heroIcon}>
            <Ionicons name="airplane-outline" size={22} color="#F97316" />
          </View>
          <View>
            <Text style={styles.heroTitle}>{VIAGEM_INSURANCE_DETAIL.title}</Text>
            <Text style={styles.heroSubtitle}>{VIAGEM_INSURANCE_DETAIL.segment}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <InfoCard
          icon="information-circle-outline"
          title="Descrição do Produto"
          body={VIAGEM_INSURANCE_DETAIL.description}
        />
        <InfoCard
          icon="people-outline"
          title="A Quem Se Destina"
          body={VIAGEM_INSURANCE_DETAIL.audience}
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações Adicionais</Text>
          <MetaRow icon="shapes-outline" label="Segmento: Particulares" />
          <MetaRow icon="calculator-outline" label="Simulação: Disponível" last />
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="document-text-outline" size={18} color="#111827" />
            <Text style={styles.cardTitle}>Documentos</Text>
          </View>
          {VIAGEM_INSURANCE_DETAIL.documents.map((doc, index) => (
            <Pressable
              key={doc.id}
              style={[styles.docRow, index === VIAGEM_INSURANCE_DETAIL.documents.length - 1 && styles.docRowLast]}
              accessibilityRole="button">
              <View style={styles.docLeft}>
                <Ionicons name="document-outline" size={18} color="#6B7280" />
                <Text style={styles.docLabel}>{doc.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#111827" />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={styles.primaryBtn}
          accessibilityRole="button"
          onPress={() => router.push('/payments/seguros/viagem/formulario')}>
          <Text style={styles.primaryBtnText}>Fazer Simulação</Text>
        </Pressable>
      </View>
    </View>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Ionicons name={icon} size={18} color="#111827" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardBody}>{body}</Text>
    </View>
  );
}

function MetaRow({
  icon,
  label,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.metaRow, last && styles.metaRowLast]}>
      <Ionicons name={icon} size={16} color="#6B7280" />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
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
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  metaRowLast: { borderBottomWidth: 0 },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
  docRowLast: { marginBottom: 0 },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  docLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: '#F3F4F6',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
