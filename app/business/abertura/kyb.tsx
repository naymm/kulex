import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BUSINESS_KYB_STEPS,
  BUSINESS_OPENING_TYPES,
  type BusinessType,
} from '@/constants/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

export default function BusinessKybScreen() {
  const insets = useSafeAreaInsets();
  const { type, fromSignup } = useLocalSearchParams<{ type?: string; fromSignup?: string }>();
  const businessType = (type === 'company' ? 'company' : 'individual') as BusinessType;
  const opening = BUSINESS_OPENING_TYPES.find((item) => item.id === businessType)!;
  const [step, setStep] = useState(2);
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});

  const toggleUpload = (doc: string) => {
    setUploaded((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  const allUploaded = opening.requirements.every((doc) => uploaded[doc]);
  const isSignup = fromSignup === '1';

  const finish = () => {
    if (isSignup) {
      router.push('/signup/phone');
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backBtn}
            onPress={() => goBackFromOrigin(undefined, () => router.back())}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Validação KYB</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 100 },
        ]}>
        <Text style={styles.typeLabel}>{opening.title}</Text>

        <View style={styles.stepsRow}>
          {BUSINESS_KYB_STEPS.map((label, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <View key={label} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    done && styles.stepDotDone,
                    active && styles.stepDotActive,
                  ]}>
                  {done ? (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.stepNum}>{index + 1}</Text>
                  )}
                </View>
                {index < BUSINESS_KYB_STEPS.length - 1 ? (
                  <View style={[styles.stepLine, done && styles.stepLineDone]} />
                ) : null}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Documentos necessários</Text>
        {opening.requirements.map((doc) => {
          const isUploaded = uploaded[doc];
          return (
            <Pressable
              key={doc}
              style={[styles.docRow, isUploaded && styles.docRowDone]}
              onPress={() => toggleUpload(doc)}>
              <View style={[styles.docIcon, isUploaded && styles.docIconDone]}>
                <Ionicons
                  name={isUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
                  size={22}
                  color={isUploaded ? '#16A34A' : TEAL}
                />
              </View>
              <View style={styles.docText}>
                <Text style={styles.docTitle}>{doc}</Text>
                <Text style={styles.docStatus}>
                  {isUploaded ? 'Documento carregado' : 'Toque para carregar'}
                </Text>
              </View>
            </Pressable>
          );
        })}

        {allUploaded ? (
          <View style={styles.validationCard}>
            <Ionicons name="shield-checkmark" size={28} color="#16A34A" />
            <Text style={styles.validationTitle}>Validação automática em curso</Text>
            <Text style={styles.validationText}>
              Os documentos serão verificados em até 24 horas. Pode continuar a configurar a conta.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable
          style={[styles.cta, !allUploaded && styles.ctaDisabled]}
          disabled={!allUploaded}
          onPress={() => {
            setStep(4);
            finish();
          }}>
          <Text style={styles.ctaText}>
            {isSignup ? 'Continuar registo' : 'Activar conta Business'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: NAVY, paddingHorizontal: 20, paddingBottom: 16, overflow: 'hidden' },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 100,
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
  content: { padding: 18 },
  typeLabel: { fontSize: 15, fontWeight: '700', color: TEAL, marginBottom: 16 },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  stepItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotDone: { backgroundColor: '#16A34A' },
  stepDotActive: { backgroundColor: NAVY },
  stepNum: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 2 },
  stepLineDone: { backgroundColor: '#16A34A' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 12 },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  docRowDone: { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docIconDone: { backgroundColor: '#DCFCE7' },
  docText: { flex: 1 },
  docTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  docStatus: { marginTop: 2, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  validationCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
  },
  validationTitle: { marginTop: 10, fontSize: 15, fontWeight: '800', color: '#166534' },
  validationText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: '#15803D',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: '#F3F4F6',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  cta: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
