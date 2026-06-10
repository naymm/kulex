import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardFlowPrimaryButton, CardFlowShell } from '@/components/cards/CardFlowShell';
import { PostpaidCardTierCarousel } from '@/components/cards/PostpaidCardTierCarousel';
import {
  getEligibleCardProducts,
  getPlafondOptionsForCard,
  POSTPAID_CARD_SCORE,
  type PlafondOption,
} from '@/constants/postpaid-card';

export default function PostpaidCardPlafondScreen() {
  const insets = useSafeAreaInsets();
  const { score } = useLocalSearchParams<{ score?: string }>();
  const scoreValue = useMemo(
    () => Number(typeof score === 'string' ? score : String(POSTPAID_CARD_SCORE)),
    [score],
  );

  const eligibleCards = useMemo(() => getEligibleCardProducts(scoreValue), [scoreValue]);
  const defaultIndex = Math.max(eligibleCards.length - 1, 0);

  const [activeCardIndex, setActiveCardIndex] = useState(defaultIndex);
  const [selectedPlafond, setSelectedPlafond] = useState<PlafondOption | undefined>();

  const selectedCard = eligibleCards[activeCardIndex];

  const plafondOptions = useMemo(
    () => (selectedCard ? getPlafondOptionsForCard(selectedCard.id) : []),
    [selectedCard],
  );

  useEffect(() => {
    if (plafondOptions.length > 0) {
      setSelectedPlafond(plafondOptions[0]);
    }
  }, [plafondOptions]);

  const handleCardIndexChange = (index: number) => {
    setActiveCardIndex(index);
    const card = eligibleCards[index];
    if (!card) return;
    const options = getPlafondOptionsForCard(card.id);
    setSelectedPlafond(options[0]);
  };

  const continueToConfirm = () => {
    if (!selectedCard || !selectedPlafond) return;

    router.push({
      pathname: '/cards/pos-pago/vencimento',
      params: {
        score: String(scoreValue),
        cardTierId: selectedCard.id,
        plafondId: selectedPlafond.id,
        plafondLabel: selectedPlafond.label,
        plafondAmount: selectedPlafond.amount,
      },
    });
  };

  if (!selectedCard || eligibleCards.length === 0) {
    return (
      <CardFlowShell title="Escolher cartão">
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Nenhum cartão disponível para o seu scoring.</Text>
        </View>
      </CardFlowShell>
    );
  }

  return (
    <CardFlowShell
      title="Escolher cartão"
      footer={<CardFlowPrimaryButton label="Continuar" onPress={continueToConfirm} />}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 120 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>
          Scoring {scoreValue}. Deslize para escolher o cartão.
        </Text>

        <PostpaidCardTierCarousel
          cards={eligibleCards}
          activeIndex={activeCardIndex}
          onActiveIndexChange={handleCardIndexChange}
        />

        <Text style={styles.sectionTitle}>Plafond</Text>
        <View style={styles.list}>
          {plafondOptions.map((option) => {
            const isSelected = selectedPlafond?.id === option.id;
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isSelected && styles.optionSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedPlafond(option)}>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionAmount}>AOA {option.amount}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={18} color="#C9A227" />
          <Text style={styles.noteText}>
            Este é o plafond mínimo do cartão seleccionado. Pode solicitar o aumento depois da
            activação, na gestão do cartão.
          </Text>
        </View>
      </ScrollView>
    </CardFlowShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 24,
  },
  list: {
    gap: 12,
  },
  noteBox: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E8C4',
    backgroundColor: '#FFFBEB',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: '#C9A227',
    backgroundColor: '#FFFBEB',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionAmount: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A4E',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioSelected: {
    borderColor: '#C9A227',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C9A227',
  },
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
