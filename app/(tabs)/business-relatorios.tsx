import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESS_REPORTS } from '@/constants/business';

const NAVY = '#1A1A4E';

export default function BusinessRelatoriosTabScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <Text style={styles.headerSubtitle}>Extractos, facturas e exportação</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        {BUSINESS_REPORTS.map((report) => (
          <Pressable
            key={report.id}
            style={styles.reportCard}
            accessibilityRole="button"
            onPress={() => router.push(report.href as never)}>
            <View style={styles.iconWrap}>
              <Ionicons name={report.icon} size={24} color={NAVY} />
            </View>
            <View style={styles.reportText}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportSubtitle}>{report.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 1,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: 18, paddingTop: 8, gap: 10, marginTop: 28 },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportText: { flex: 1 },
  reportTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  reportSubtitle: { marginTop: 3, fontSize: 13, fontWeight: '500', color: '#6B7280' },
});
