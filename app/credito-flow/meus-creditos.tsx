import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditoFlowHeader, NAVY } from '@/components/credito-flow/CreditoFlowHeader';
import { useRedirectBusinessFromPersonalCredit } from '@/hooks/useRedirectBusinessFromPersonalCredit';
import { getMeusCreditosItems } from '@/lib/credit-loans';

export default function MeusCreditos() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(getMeusCreditosItems);
  const isBusiness = useRedirectBusinessFromPersonalCredit();

  useFocusEffect(
    useCallback(() => {
      setItems(getMeusCreditosItems());
    }, []),
  );

  if (isBusiness) return null;

  return (
    <View style={styles.container}>
      <CreditoFlowHeader title="Meus créditos" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 12) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {items.map((it) => (
          <Pressable
            key={it.id}
            style={styles.item}
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/credito-flow/meus-creditos/[credit]',
                params: { credit: it.id },
              })
            }
          >
            <View style={[styles.leftIcon, it.kind === 'adiantamento' && styles.leftIconAdvance]}>
              <Ionicons
                name={it.kind === 'adiantamento' ? 'flash-outline' : 'speedometer-outline'}
                size={18}
                color="#111827"
              />
            </View>

            <View style={styles.itemBody}>
              <View style={styles.titleRow}>
                <Text style={styles.itemTitle}>{it.title}</Text>
                {it.showChevron ? (
                  <Ionicons name="chevron-forward" size={18} color="#111827" />
                ) : null}
              </View>
              <Text style={styles.itemPrazo}>{it.prazo}</Text>

              <View style={styles.progressRow}>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.round(it.progress * 100)}%` }]} />
                </View>
              </View>
              <Text style={styles.emFalta}>{it.emFalta}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 22 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 26,
  },
  leftIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  leftIconAdvance: {
    borderColor: '#C9A227',
    backgroundColor: '#FFFBEB',
  },
  itemBody: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { fontSize: 14, fontWeight: '800', color: '#111827', flex: 1, paddingRight: 10 },
  itemPrazo: { marginTop: 6, fontSize: 12, color: '#6B7280', fontWeight: '500' },
  progressRow: { marginTop: 10 },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: NAVY,
  },
  emFalta: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
  },
});
