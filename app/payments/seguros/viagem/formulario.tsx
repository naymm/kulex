import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InsuranceSelectSheet } from '@/components/insurance/InsuranceSelectSheet';
import {
  DEFAULT_TRAVEL_FORM,
  DESTINO_OPTIONS,
  ORIGEM_OPTIONS,
  PASSAGEIROS_OPTIONS,
} from '@/constants/viagem-insurance';

const NAVY = '#1A1A4E';

type SelectField = 'origem' | 'destino' | 'adultos' | 'criancas' | null;

export default function ViagemInsuranceFormScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState(DEFAULT_TRAVEL_FORM);
  const [selectField, setSelectField] = useState<SelectField>(null);

  const selectConfig = {
    origem: { title: 'Origem', options: ORIGEM_OPTIONS, value: form.origem },
    destino: { title: 'Destino', options: DESTINO_OPTIONS, value: form.destino },
    adultos: { title: 'Adultos', options: PASSAGEIROS_OPTIONS, value: form.adultos },
    criancas: { title: 'Crianças', options: PASSAGEIROS_OPTIONS, value: form.criancas },
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
            <Text style={styles.headerTitle}>Produto de Viagem</Text>
          </View>
          <View style={styles.planeWrap}>
            <Ionicons name="airplane" size={52} color="#FFFFFF" />
          </View>
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
          label="Origem"
          icon="globe-outline"
          value={form.origem}
          placeholder="Selecione a origem"
          onPress={() => setSelectField('origem')}
        />
        <SelectField
          label="Destino"
          icon="map-outline"
          value={form.destino}
          placeholder="Selecione o destino"
          onPress={() => setSelectField('destino')}
        />
        <DateField label="Início" value={form.inicio} />
        <DateField label="Fim" value={form.fim} />
        <SelectField
          label="Adultos"
          icon="person-outline"
          value={form.adultos}
          placeholder="Selecione"
          onPress={() => setSelectField('adultos')}
        />
        <SelectField
          label="Crianças"
          icon="person-outline"
          value={form.criancas}
          placeholder="Selecione"
          onPress={() => setSelectField('criancas')}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push('/payments/seguros/viagem/tomador')}
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
    </View>
  );
}

function SelectField({
  label,
  icon,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.selectField} onPress={onPress} accessibilityRole="button">
        <Ionicons name={icon} size={16} color="#9CA3AF" />
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </Pressable>
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
  planeWrap: {
    width: 88,
    height: 72,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
