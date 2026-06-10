import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESS_OPENING_TYPES, type BusinessType } from '@/constants/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

export default function BusinessAberturaScreen() {
  const insets = useSafeAreaInsets();

  const selectType = (type: BusinessType) => {
    router.push({ pathname: '/business/abertura/kyb', params: { type } });
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
          <Text style={styles.headerTitle}>Abrir conta Business</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}>
        <Text style={styles.intro}>
          Escolha o tipo de negócio para iniciar a validação KYB e activar a sua conta empresarial.
        </Text>

        {BUSINESS_OPENING_TYPES.map((item) => (
          <Pressable
            key={item.id}
            style={styles.typeCard}
            accessibilityRole="button"
            onPress={() => selectType(item.id)}>
            <View style={styles.typeIcon}>
              <Ionicons
                name={item.id === 'individual' ? 'person-outline' : 'business-outline'}
                size={28}
                color={TEAL}
              />
            </View>
            <View style={styles.typeText}>
              <Text style={styles.typeTitle}>{item.title}</Text>
              <Text style={styles.typeDesc}>{item.description}</Text>
              <View style={styles.requirements}>
                {item.requirements.slice(0, 3).map((req) => (
                  <Text key={req} style={styles.reqItem}>
                    · {req}
                  </Text>
                ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
          </Pressable>
        ))}
      </ScrollView>
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
  intro: { marginBottom: 16, fontSize: 14, lineHeight: 20, color: '#6B7280' },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: { flex: 1 },
  typeTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  typeDesc: { marginTop: 4, fontSize: 13, fontWeight: '500', color: '#6B7280' },
  requirements: { marginTop: 10, gap: 2 },
  reqItem: { fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
});
