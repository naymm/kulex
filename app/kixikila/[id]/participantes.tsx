import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KixikilaDetailHeader,
  KixikilaParticipantRow,
  kixikilaDetailStyles,
} from '@/components/kixikila/KixikilaDetailUi';
import {
  getKixikilaDetail,
  getNextReceiver,
  getOrderedParticipants,
} from '@/constants/kixikila';

function useKixikilaDetailFromParams() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return getKixikilaDetail(typeof id === 'string' ? id : undefined);
}

export default function KixikilaParticipantesScreen() {
  const insets = useSafeAreaInsets();
  const detail = useKixikilaDetailFromParams();

  if (!detail) return null;

  const participants = getOrderedParticipants(detail);
  const nextReceiver = getNextReceiver(detail);

  return (
    <View style={kixikilaDetailStyles.container}>
      <KixikilaDetailHeader
        title="Participantes"
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
          {participants.map((participant, index) => {
            const isNext = participant.id === nextReceiver?.id;
            return (
              <KixikilaParticipantRow
                key={participant.id}
                participant={participant}
                badge={`${participant.order}º na ordem`}
                last={index === participants.length - 1}
                trailing={
                  <View style={{ alignItems: 'flex-end' }}>
                      {isNext ? (
                        <View style={[kixikilaDetailStyles.statusPill, kixikilaDetailStyles.nextPill]}>
                          <Text
                            style={[
                              kixikilaDetailStyles.statusPillText,
                              kixikilaDetailStyles.nextPillText,
                            ]}>
                            Próximo
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  }
                />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
