import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InsuranceProgressStepper } from '@/components/insurance/InsuranceProgressStepper';
import { InsuranceSelectSheet } from '@/components/insurance/InsuranceSelectSheet';
import {
  DEFAULT_POLICYHOLDER,
  GENERO_OPTIONS,
} from '@/constants/automovel-insurance';
import { INSURANCE_ACCENT } from '@/constants/insurance';
import { VIAGEM_INSURANCE_STEPS } from '@/constants/viagem-insurance';

const NAVY = '#1A1A4E';

export default function ViagemInsuranceTomadorScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState(DEFAULT_POLICYHOLDER);
  const [generoOpen, setGeneroOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.brand}>PROTTEJA SEGUROS</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <InsuranceProgressStepper steps={VIAGEM_INSURANCE_STEPS} currentStep={2} />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>É cliente?</Text>
          <Switch
            value={form.isCliente}
            onValueChange={(isCliente) => setForm((prev) => ({ ...prev, isCliente }))}
            trackColor={{ false: '#D1D5DB', true: NAVY }}
            thumbColor="#FFFFFF"
          />
        </View>

        <FormField
          label="Nome Completo"
          icon="person-outline"
          value={form.nome}
          onChangeText={(nome) => setForm((prev) => ({ ...prev, nome }))}
        />
        <FormField
          label="Número de Documento (BI/Passaporte)"
          icon="card-outline"
          value={form.documento}
          onChangeText={(documento) => setForm((prev) => ({ ...prev, documento }))}
        />
        <FormField
          label="NIF"
          icon="id-card-outline"
          value={form.nif}
          onChangeText={(nif) => setForm((prev) => ({ ...prev, nif }))}
        />
        <FormField
          label="Insira seu numero de telefone"
          icon="call-outline"
          value={form.telefone}
          onChangeText={(telefone) => setForm((prev) => ({ ...prev, telefone }))}
          keyboardType="phone-pad"
        />
        <FormField
          label="Email"
          icon="mail-outline"
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          keyboardType="email-address"
        />
        <FormField
          label="Morada"
          icon="location-outline"
          value={form.morada}
          onChangeText={(morada) => setForm((prev) => ({ ...prev, morada }))}
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <FormField
              label="Data Nascimento"
              icon="calendar-outline"
              value={form.dataNascimento}
              onChangeText={(dataNascimento) =>
                setForm((prev) => ({ ...prev, dataNascimento }))
              }
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>Género</Text>
            <Pressable style={styles.selectField} onPress={() => setGeneroOpen(true)}>
              <Ionicons name="male-female-outline" size={16} color="#9CA3AF" />
              <Text style={styles.selectText}>{form.genero}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push('/payments/seguros/viagem/resumo')}
          accessibilityRole="button">
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </Pressable>
      </View>

      <InsuranceSelectSheet
        visible={generoOpen}
        title="Género"
        options={[...GENERO_OPTIONS]}
        selected={form.genero}
        onClose={() => setGeneroOpen(false)}
        onSelect={(genero) => setForm((prev) => ({ ...prev, genero }))}
      />
    </View>
  );
}

function FormField({
  label,
  icon,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <Ionicons name={icon} size={16} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  headerSpacer: { width: 40, height: 40 },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    gap: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  inputWrap: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputWrapFocused: {
    borderWidth: 1,
    borderColor: INSURANCE_ACCENT,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: { flex: 1 },
  selectField: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
