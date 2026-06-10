import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SignupShell } from '@/components/signup/SignupShell';
import { SignupTextField } from '@/components/signup/SignupTextField';
import { BUSINESS_OPENING_TYPES, type BusinessType } from '@/constants/business';

const TEAL = '#2FB7A9';

export default function SignupBusinessScreen() {
  const [businessType, setBusinessType] = useState<BusinessType>('individual');
  const [companyName, setCompanyName] = useState('');
  const [nif, setNif] = useState('');
  const [location, setLocation] = useState('');

  const selected = BUSINESS_OPENING_TYPES.find((item) => item.id === businessType)!;
  const canContinue = companyName.trim().length > 2 && nif.trim().length >= 9 && location.trim().length > 2;

  return (
    <SignupShell
      title="Dados da sua empresa"
      subtitle="Conta Business com facturação, crédito de stock e relatórios para a sua loja."
      buttonLabel="Continuar para KYB"
      onContinue={() => {
        if (!canContinue) return;
        router.push({
          pathname: '/business/abertura/kyb',
          params: { type: businessType, fromSignup: '1' },
        });
      }}
      scrollable>
      <Text style={styles.sectionLabel}>Tipo de negócio</Text>
      <View style={styles.typeList}>
        {BUSINESS_OPENING_TYPES.map((item) => {
          const active = businessType === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.typeRow, active && styles.typeRowActive]}
              onPress={() => setBusinessType(item.id)}>
              <Ionicons
                name={item.id === 'individual' ? 'person-outline' : 'business-outline'}
                size={22}
                color={active ? TEAL : '#6B7280'}
              />
              <View style={styles.typeText}>
                <Text style={[styles.typeTitle, active && styles.typeTitleActive]}>
                  {item.title}
                </Text>
                <Text style={styles.typeDesc}>{item.description}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]} />
            </Pressable>
          );
        })}
      </View>

      <SignupTextField
        label={businessType === 'individual' ? 'Nome comercial' : 'Razão social'}
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Ex.: Kulex Store Luanda"
      />
      <SignupTextField
        label="NIF"
        value={nif}
        onChangeText={(t) => setNif(t.replace(/\D/g, '').slice(0, 14))}
        keyboardType="number-pad"
        placeholder="Número de identificação fiscal"
      />
      <SignupTextField
        label="Localização"
        value={location}
        onChangeText={setLocation}
        placeholder="Ex.: Talatona, Luanda"
      />

      <View style={styles.reqCard}>
        <Text style={styles.reqTitle}>Documentos para {selected.title}</Text>
        {selected.requirements.map((req) => (
          <Text key={req} style={styles.reqItem}>
            · {req}
          </Text>
        ))}
      </View>
    </SignupShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  typeList: { gap: 8, marginBottom: 20 },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  typeRowActive: { borderColor: TEAL, backgroundColor: '#F0FDFA' },
  typeText: { flex: 1 },
  typeTitle: { fontSize: 15, fontWeight: '700', color: '#374151' },
  typeTitleActive: { color: '#111827' },
  typeDesc: { marginTop: 2, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  radioActive: { backgroundColor: TEAL, borderColor: TEAL },
  reqCard: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  reqTitle: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
  reqItem: { fontSize: 12, lineHeight: 18, color: '#6B7280' },
});
