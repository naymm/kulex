import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountAvatar } from '@/components/menu/AccountSwitcherSheet';
import { getPersonalData, getPersonalDataSections, type PersonalDataField } from '@/constants/personal-data';
import { useActiveAccount } from '@/contexts/AccountContext';
import { goBackFromOrigin, withOriginParams } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';

type DataFieldProps = {
  field: PersonalDataField;
  last?: boolean;
};

function DataField({ field, last }: DataFieldProps) {
  return (
    <View style={[styles.fieldRow, last && styles.fieldRowLast]}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      <Text style={styles.fieldValue}>{field.value}</Text>
    </View>
  );
}

export default function MeusDadosScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { activeAccount, activeAccountId } = useActiveAccount();
  const personalData = getPersonalData(activeAccountId);
  const personalDataSections = getPersonalDataSections(activeAccountId);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => goBackFromOrigin(from)}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Meus Dados</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <AccountAvatar account={activeAccount} size={88} style={styles.avatar} />
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.profileName}>{personalData.fullName}</Text>
          <Text style={styles.profileAccountType}>{personalData.accountType}</Text>
          <View style={styles.kycBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#059669" />
            <Text style={styles.kycBadgeText}>{personalData.kycStatus}</Text>
          </View>
        </View>

        {personalDataSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.fields.map((field, index) => (
                <DataField
                  key={field.id}
                  field={field}
                  last={index === section.fields.length - 1}
                />
              ))}
            </View>
          </View>
        ))}

        <Pressable
          style={styles.editBtn}
          accessibilityRole="button"
          onPress={() =>
            router.push({ pathname: '/kyc', params: withOriginParams(from) })
          }>
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          <Text style={styles.editBtnText}>Actualizar dados</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#EEF0F8',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  profileAccountType: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
  },
  kycBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fieldRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  fieldRowLast: {
    borderBottomWidth: 0,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  fieldValue: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 21,
  },
  editBtn: {
    marginTop: 4,
    height: 50,
    borderRadius: 25,
    backgroundColor: NAVY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
