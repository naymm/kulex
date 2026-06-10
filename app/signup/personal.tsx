import { router } from 'expo-router';
import { useState } from 'react';
import {
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

type IdDocumentType = 'nacional' | 'estrangeiro';

const ACCENT = '#C9A227';
const DEFAULT_BIRTH_DATE = new Date(2000, 0, 1);

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
  const [idType, setIdType] = useState<IdDocumentType>('nacional');
  const [idNumber, setIdNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState<(typeof MONTHS_PT)[number]>('Janeiro');
  const [year, setYear] = useState('');
  const [monthOpen, setMonthOpen] = useState(false);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState(DEFAULT_BIRTH_DATE);

  const idPlaceholder =
    idType === 'nacional'
      ? 'Insira o número do seu BI'
      : 'Insira o número do seu documento';

  const openDayPicker = () => {
    setPickerDate(getBirthDate(day, month, year));
    setDayPickerOpen(true);
  };

  const applyBirthDate = (date: Date) => {
    setPickerDate(date);
    setDay(String(date.getDate()).padStart(2, '0'));
    setMonth(MONTHS_PT[date.getMonth()]);
    setYear(String(date.getFullYear()));
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
            onPress={() => setIdType('nacional')}>
            <Text style={styles.idToggleText}>Nacional</Text>
          </Pressable>
          <Pressable
            style={[styles.idToggle, idType === 'estrangeiro' && styles.idToggleActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: idType === 'estrangeiro' }}
            onPress={() => setIdType('estrangeiro')}>
            <Text style={styles.idToggleText}>Estrangeiro</Text>
          </Pressable>
        </View>
        <SignupTextField
          value={idNumber}
          onChangeText={setIdNumber}
          placeholder={idPlaceholder}
        />

        <SignupTextField label="Nome Completo" value={fullName} onChangeText={setFullName} />
        <SignupTextField label="Apelido" value={nickname} onChangeText={setNickname} />

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
