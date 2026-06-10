import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostpaidCardPreview } from '@/components/cards/PostpaidCardPreview';
import { NEW_CARD_TYPE_OPTIONS, WALLET_CARD_ASPECT } from '@/constants/card';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';
const PREPAID_ASSET = require('../../assets/images/cartao.png');
const PREVIEW_WIDTH = 120;

export default function AdicionarCartaoScreen() {
  const insets = useSafeAreaInsets();
  const previewHeight = PREVIEW_WIDTH / WALLET_CARD_ASPECT;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Adicionar cartão</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.introTitle}>Escolha o tipo de cartão</Text>
        <Text style={styles.introSubtitle}>
          Selecione entre cartão pré-pago ou pós-pago para continuar com a solicitação.
        </Text>

        <View style={styles.list}>
          {NEW_CARD_TYPE_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={styles.optionCard}
              accessibilityRole="button"
              accessibilityLabel={`${option.typeLabel} — ${option.title}`}
              onPress={() => router.push(option.route)}>
              <View style={styles.previewWrap}>
                {option.id === 'prepaid' ? (
                  <Image
                    source={PREPAID_ASSET}
                    style={{ width: PREVIEW_WIDTH, height: previewHeight }}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                  />
                ) : (
                  <PostpaidCardPreview
                    cardTierId="black"
                    width={PREVIEW_WIDTH}
                    height={previewHeight}
                    embedded
                  />
                )}
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{option.typeLabel}</Text>
                </View>
              </View>

              <View style={styles.optionBody}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Ionicons name="chevron-forward" size={18} color={NAVY} />
                </View>
                <Text style={styles.optionDescription}>{option.description}</Text>
                <View style={styles.typePill}>
                  <Text style={styles.typePillText}>{option.typeLabel}</Text>
                </View>
              </View>
            </Pressable>
          ))}
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 30,
  },
  introSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 20,
  },
  list: {
    marginTop: 24,
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  previewWrap: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#EEF0F8',
  },
  typeBadge: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(26, 26, 78, 0.75)',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  optionBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  optionDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
  },
  typePill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: GOLD,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: NAVY,
  },
});
