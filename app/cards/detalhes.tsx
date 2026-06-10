import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MastercardLogo } from '@/components/cards/MastercardLogo';
import {
  CARD_BILLING_ADDRESS,
  CARD_CVV,
  CARD_EXPIRY,
  CARD_HOLDER_DISPLAY,
  CARD_NUMBER_FULL,
  CARD_NUMBER_RAW,
  CARD_POSTAL_CODE,
} from '@/constants/card';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

type DetailFieldProps = {
  label: string;
  value: string;
  copyValue?: string;
  last?: boolean;
};

function DetailField({ label, value, copyValue, last }: DetailFieldProps) {
  const copy = async () => {
    await Clipboard.setStringAsync(copyValue ?? value);
  };

  return (
    <View style={[styles.fieldRow, last && styles.fieldRowLast]}>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
      <Pressable
        style={styles.copyBtn}
        accessibilityRole="button"
        accessibilityLabel={`Copiar ${label.toLowerCase()}`}
        onPress={copy}>
        <Ionicons name="copy-outline" size={18} color="#9CA3AF" />
      </Pressable>
    </View>
  );
}

export default function CardDetalhesScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} accessibilityRole="button" onPress={() => goBackFromOrigin(from)}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Detalhes do cartão</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>
            Seu cartão virtual
          </Text>
          <MastercardLogo size={34} />
        </View>

        <Pressable style={styles.aboutBtn} accessibilityRole="button">
          <Text style={styles.aboutBtnText}>Sobre este cartão</Text>
        </Pressable>

        <View style={styles.detailsCard}>
          <DetailField label="Nome do cartão" value={CARD_HOLDER_DISPLAY} />
          <DetailField
            label="Número do cartão"
            value={CARD_NUMBER_FULL}
            copyValue={CARD_NUMBER_RAW}
          />
          <DetailField label="CVV" value={CARD_CVV} />
          <DetailField label="Data de expiração" value={CARD_EXPIRY} />
          <DetailField label="Endereço de cobrança" value={CARD_BILLING_ADDRESS} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  pageTitle: {
    flex: 1,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#111827',
  },
  aboutBtn: {
    alignSelf: 'flex-start',
    marginTop: 20,
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailsCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  fieldRowLast: {
    borderBottomWidth: 0,
  },
  fieldContent: {
    flex: 1,
    paddingRight: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  fieldValue: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
