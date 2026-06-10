import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KixikilaDetailHeader,
  KixikilaParticipantRow,
  kixikilaDetailStyles,
} from '@/components/kixikila/KixikilaDetailUi';
import { getContributors, getKixikilaDetail } from '@/constants/kixikila';

export default function KixikilaContribuicoesScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const detail = getKixikilaDetail(typeof id === 'string' ? id : undefined);

  if (!detail) return null;

  const contributors = getContributors(detail).sort((a, b) => a.order - b.order);

  return (
    <View style={kixikilaDetailStyles.container}>
      <KixikilaDetailHeader
        title="Quem já contribuiu"
        subtitle={detail.title}
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={[
          kixikilaDetailStyles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={kixikilaDetailStyles.listCard}>
          {contributors.length > 0 ? (
            contributors.map((participant, index) => (
              <KixikilaParticipantRow
                key={participant.id}
                participant={participant}
                badge={`Contribuição: ${detail.amountPerMember}`}
                last={index === contributors.length - 1}
                trailing={
                    <View style={kixikilaDetailStyles.statusPill}>
                      <Text style={kixikilaDetailStyles.statusPillText}>Pago</Text>
                    </View>
                  }
                />
            ))
          ) : (
            <Text style={styles.empty}>Ainda não há contribuições registadas.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 20,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
