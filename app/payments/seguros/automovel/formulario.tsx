import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AutoSimulationModal } from '@/components/insurance/AutoSimulationModal';
import { InsuranceSelectSheet } from '@/components/insurance/InsuranceSelectSheet';
import {
  COR_OPTIONS,
  DEFAULT_VEHICLE_FORM,
  LUGARES_OPTIONS,
  MARCA_OPTIONS,
  MODELO_OPTIONS,
} from '@/constants/automovel-insurance';
import { INSURANCE_ACCENT } from '@/constants/insurance';

const NAVY = '#1A1A4E';
const CAR_IMAGE = require('../../../../assets/images/carro.png');

type SelectField = 'marca' | 'modelo' | 'lugares' | 'cor' | null;

export default function AutoInsuranceFormScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState(DEFAULT_VEHICLE_FORM);
  const [selectField, setSelectField] = useState<SelectField>(null);
  const [simulationOpen, setSimulationOpen] = useState(false);

  const selectConfig = {
    marca: { title: 'Marca', options: MARCA_OPTIONS, value: form.marca },
    modelo: { title: 'Modelo', options: MODELO_OPTIONS, value: form.modelo },
    lugares: { title: 'Lugares', options: LUGARES_OPTIONS, value: form.lugares },
    cor: { title: 'Cor', options: COR_OPTIONS, value: form.cor },
  } as const;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerMain}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.brand}>PROTTEJA SEGUROS</Text>
            <Text style={styles.headerTitle}>Produto Automóvel</Text>
          </View>
          <Image source={CAR_IMAGE} style={styles.carImage} resizeMode="contain" />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <SelectField
          label="Marca"
          value={form.marca}
          placeholder="Selecione uma marca"
          onPress={() => setSelectField('marca')}
        />
        <SelectField
          label="Modelo"
          value={form.modelo}
          placeholder="Selecione um modelo"
          onPress={() => setSelectField('modelo')}
        />
        <TextField
          label="Cilindrada"
          value={form.cilindrada}
          onChangeText={(cilindrada) => setForm((prev) => ({ ...prev, cilindrada }))}
        />
        <TextField
          label="Matrícula"
          value={form.matricula}
          onChangeText={(matricula) => setForm((prev) => ({ ...prev, matricula }))}
        />
        <View style={styles.row}>
          <View style={styles.half}>
            <DateField label="Data da Primeira Matrícula" value={form.dataPrimeiraMatricula} />
          </View>
          <View style={styles.half}>
            <DateField label="Data de Início do Seguro" value={form.dataInicioSeguro} />
          </View>
        </View>
        <SelectField
          label="Lugares"
          value={form.lugares}
          placeholder="Selecione os lugares"
          onPress={() => setSelectField('lugares')}
        />
        <SelectField
          label="Cor"
          value={form.cor}
          placeholder="Selecione a cor"
          onPress={() => setSelectField('cor')}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => setSimulationOpen(true)}
          accessibilityRole="button">
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </Pressable>
      </View>

      {selectField ? (
        <InsuranceSelectSheet
          visible
          title={selectConfig[selectField].title}
          options={[...selectConfig[selectField].options]}
          selected={selectConfig[selectField].value}
          onClose={() => setSelectField(null)}
          onSelect={(value) => {
            setForm((prev) => ({ ...prev, [selectField]: value }));
            setSelectField(null);
          }}
        />
      ) : null}

      <AutoSimulationModal
        visible={simulationOpen}
        onClose={() => setSimulationOpen(false)}
        onContinue={() => {
          setSimulationOpen(false);
          router.push('/payments/seguros/automovel/tomador');
        }}
      />
    </View>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.selectField} onPress={onPress} accessibilityRole="button">
        <Ionicons name="location-outline" size={16} color="#9CA3AF" />
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </Pressable>
    </View>
  );
}

function TextField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, focused && styles.inputFocused]}
        placeholderTextColor="#9CA3AF"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

function DateField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.selectField}>
        <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
        <Text style={styles.selectText}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextWrap: { flex: 1, paddingRight: 12 },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.2,
  },
  headerTitle: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  carImage: {
    width: 120,
    height: 72,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
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
  placeholderText: {
    color: '#9CA3AF',
  },
  input: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: INSURANCE_ACCENT,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: { flex: 1 },
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
