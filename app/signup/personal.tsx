import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SignupSelectField } from '@/components/signup/SignupSelectField';
import { SignupShell, signupStyles, SIGNUP_HORIZONTAL_PADDING } from '@/components/signup/SignupShell';
import { SignupTextField } from '@/components/signup/SignupTextField';
import { MONTHS_PT } from '@/constants/signup';
import { useSignup } from '@/contexts/signup-context';
import {
  fetchBiData,
  isCompleteBiNumber,
  normalizeBiNumber,
  parseBiBirthDate,
} from '@/lib/bi-lookup';

type IdDocumentType = 'nacional' | 'estrangeiro';

const ACCENT = '#C9A227';
const DEFAULT_BIRTH_DATE = new Date(2000, 0, 1);
const BI_LOOKUP_DELAY_MS = 600;

function getBirthDate(day: string, month: (typeof MONTHS_PT)[number], year: string) {
  const monthIndex = MONTHS_PT.indexOf(month);
  const dayNum = parseInt(day, 10);
  const yearNum = parseInt(year, 10);

  if (monthIndex >= 0 && dayNum >= 1 && dayNum <= 31 && yearNum >= 1900) {
    return new Date(yearNum, monthIndex, dayNum);
  }

  return DEFAULT_BIRTH_DATE;
}

export default function SignupPersonalScreen() {
  const insets = useSafeAreaInsets();
  const { idNumber, setIdNumber, fullName, setFullName, setNif } = useSignup();
  const [idType, setIdType] = useState<IdDocumentType>('nacional');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState<(typeof MONTHS_PT)[number]>('Janeiro');
  const [year, setYear] = useState('');
  const [monthOpen, setMonthOpen] = useState(false);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState(DEFAULT_BIRTH_DATE);
  const [biLoading, setBiLoading] = useState(false);
  const [biError, setBiError] = useState<string | null>(null);
  const [biVerified, setBiVerified] = useState(false);
  const lookupRequestRef = useRef(0);

  const idPlaceholder =
    idType === 'nacional'
      ? 'Insira o número do seu BI'
      : 'Insira o número do seu documento';

  const applyBirthDate = (date: Date) => {
    setPickerDate(date);
    setDay(String(date.getDate()).padStart(2, '0'));
    setMonth(MONTHS_PT[date.getMonth()]);
    setYear(String(date.getFullYear()));
  };

  const openDayPicker = () => {
    setPickerDate(getBirthDate(day, month, year));
    setDayPickerOpen(true);
  };

  const onDayPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setDayPickerOpen(false);
      return;
    }

    if (selectedDate) {
      applyBirthDate(selectedDate);
    }

    if (Platform.OS === 'android') {
      setDayPickerOpen(false);
    }
  };

  const handleIdNumberChange = (value: string) => {
    const next =
      idType === 'nacional'
        ? normalizeBiNumber(value).replace(/[^0-9A-Z]/g, '').slice(0, 14)
        : value.trim();

    setIdNumber(next);
    setBiVerified(false);
    setBiError(null);

    if (idType === 'nacional' && next.length < 14) {
      setFullName('');
      setNif('');
      setDay('');
      setYear('');
      setMonth('Janeiro');
    }
  };

  useEffect(() => {
    if (idType !== 'nacional' || !isCompleteBiNumber(idNumber)) {
      setBiLoading(false);
      return;
    }

    const requestId = ++lookupRequestRef.current;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setBiLoading(true);
      setBiError(null);

      void fetchBiData(idNumber, controller.signal)
        .then((data) => {
          if (lookupRequestRef.current !== requestId) return;

          setFullName(data.nome_completo.trim());
          setNif(data.nif.trim());

          const birthDate = parseBiBirthDate(data.data_nasc);
          if (birthDate) {
            applyBirthDate(birthDate);
          }

          setBiVerified(true);
          setBiError(null);
        })
        .catch((error: unknown) => {
          if (lookupRequestRef.current !== requestId) return;
          if (error instanceof Error && error.name === 'AbortError') return;

          setBiVerified(false);
          setBiError(
            error instanceof Error ? error.message : 'Não foi possível consultar o BI.',
          );
        })
        .finally(() => {
          if (lookupRequestRef.current === requestId) {
            setBiLoading(false);
          }
        });
    }, BI_LOOKUP_DELAY_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [idNumber, idType, setFullName, setNif]);

  return (
    <>
      <SignupShell
        title="Conte-nos sobre você"
        buttonLabel="Continue"
        onContinue={() => router.push('/signup/pin')}
        scrollable>
        <Text style={signupStyles.label}>Documento de Identificação</Text>
        <View style={styles.idToggleRow}>
          <Pressable
            style={[styles.idToggle, idType === 'nacional' && styles.idToggleActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: idType === 'nacional' }}
            onPress={() => {
              setIdType('nacional');
              setBiError(null);
              setBiVerified(false);
            }}>
            <Text style={styles.idToggleText}>Nacional</Text>
          </Pressable>
          <Pressable
            style={[styles.idToggle, idType === 'estrangeiro' && styles.idToggleActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: idType === 'estrangeiro' }}
            onPress={() => {
              setIdType('estrangeiro');
              setBiError(null);
              setBiVerified(false);
              setBiLoading(false);
            }}>
            <Text style={styles.idToggleText}>Estrangeiro</Text>
          </Pressable>
        </View>

        <SignupTextField
          value={idNumber}
          onChangeText={handleIdNumberChange}
          placeholder={idPlaceholder}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        {idType === 'nacional' ? (
          <View style={styles.biStatusRow}>
            {biLoading ? (
              <>
                <ActivityIndicator size="small" color="#1A1A4E" />
                <Text style={styles.biStatusText}>A consultar o BI...</Text>
              </>
            ) : biVerified ? (
              <Text style={styles.biSuccessText}>Dados do BI carregados automaticamente.</Text>
            ) : biError ? (
              <Text style={styles.biErrorText}>{biError}</Text>
            ) : isCompleteBiNumber(idNumber) ? null : (
              <Text style={styles.biHintText}>Introduza os 14 caracteres do BI.</Text>
            )}
          </View>
        ) : null}

        <SignupTextField
          label="Nome Completo"
          value={fullName}
          onChangeText={setFullName}
          editable={!biLoading}
        />

        <Text style={[signupStyles.label, styles.birthLabel]}>Data de Nascimento</Text>
        <View style={styles.dateRow}>
          <View style={styles.dateCol}>
            <SignupSelectField
              label="Dia"
              value={day}
              placeholder="DD"
              onPress={openDayPicker}
            />
          </View>
          <View style={[styles.dateCol, styles.monthCol]}>
            <SignupSelectField label="Mês" value={month} onPress={() => setMonthOpen(true)} />
          </View>
          <View style={styles.dateCol}>
            <SignupTextField
              label="Ano"
              value={year}
              onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
              textAlign="center"
              inputStyle={styles.yearInput}
            />
          </View>
        </View>
      </SignupShell>

      {dayPickerOpen && Platform.OS === 'android' ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={onDayPickerChange}
        />
      ) : null}

      <Modal
        visible={dayPickerOpen && Platform.OS === 'ios'}
        transparent
        animationType="slide"
        onRequestClose={() => setDayPickerOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setDayPickerOpen(false)} />
        <View style={[styles.dateSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={onDayPickerChange}
            locale="pt-PT"
            style={styles.datePicker}
          />
          <Pressable
            style={styles.dateConfirmBtn}
            accessibilityRole="button"
            onPress={() => setDayPickerOpen(false)}>
            <Text style={styles.dateConfirmText}>Confirmar</Text>
          </Pressable>
        </View>
      </Modal>

      <Modal visible={monthOpen} transparent animationType="slide" onRequestClose={() => setMonthOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMonthOpen(false)} />
        <View style={[styles.monthSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <ScrollView>
            {MONTHS_PT.map((m) => (
              <Pressable
                key={m}
                style={styles.monthItem}
                onPress={() => {
                  setMonth(m);
                  setMonthOpen(false);
                }}>
                <Text style={[styles.monthItemText, m === month && styles.monthSelected]}>{m}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  idToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  idToggle: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  idToggleActive: {
    backgroundColor: ACCENT,
  },
  idToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  biStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -4,
    marginBottom: 8,
    minHeight: 20,
  },
  biStatusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  biHintText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  biSuccessText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  biErrorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  birthLabel: {
    marginBottom: 0,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  dateCol: { flex: 1 },
  monthCol: { flex: 1.6 },
  yearInput: {
    paddingHorizontal: 12,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  dateSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  datePicker: {
    alignSelf: 'center',
  },
  dateConfirmBtn: {
    marginHorizontal: SIGNUP_HORIZONTAL_PADDING,
    marginTop: 8,
    marginBottom: 8,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  monthSheet: {
    maxHeight: '50%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  monthItem: { paddingVertical: 14, paddingHorizontal: SIGNUP_HORIZONTAL_PADDING },
  monthItemText: { fontSize: 16, color: '#111827' },
  monthSelected: { fontWeight: '700', color: '#1A1A4E' },
});
