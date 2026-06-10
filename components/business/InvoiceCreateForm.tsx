import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BUSINESS_PROFILE,
  INVOICE_CLIENTS,
  INVOICE_TYPES,
  VAT_REGIMES,
  type InvoiceType,
  type VatRegime,
} from '@/constants/business';
import {
  computeInvoiceSummary,
  createEmptyLineItem,
  formatCents,
  lineItemValueCents,
  parsePriceInput,
  parseQuantityInput,
  type InvoiceLineItem,
} from '@/lib/business-invoice';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

type Props = {
  initialType?: InvoiceType;
  onPreview: (draft: {
    invoiceType: InvoiceType;
    clientName: string;
    clientEmail: string;
    title: string;
    dueDate: Date | null;
    items: InvoiceLineItem[];
    discountDigits: string;
    vatRegime: VatRegime;
    notes: string;
  }) => void;
  onSaveDraft: () => void;
};

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

export function InvoiceCreateForm({ initialType = 'normal', onPreview, onSaveDraft }: Props) {
  const insets = useSafeAreaInsets();
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(initialType);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientEmail, setClientEmail] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [items, setItems] = useState<InvoiceLineItem[]>([createEmptyLineItem()]);
  const [discountDigits, setDiscountDigits] = useState('');
  const [vatRegime, setVatRegime] = useState<VatRegime>('general');
  const [notes, setNotes] = useState('');
  const [clientSheetOpen, setClientSheetOpen] = useState(false);
  const [typeSheetOpen, setTypeSheetOpen] = useState(false);
  const [vatSheetOpen, setVatSheetOpen] = useState(false);

  const selectedClient = INVOICE_CLIENTS.find((c) => c.id === clientId);
  const selectedType = INVOICE_TYPES.find((t) => t.id === invoiceType)!;
  const selectedVat = VAT_REGIMES.find((v) => v.id === vatRegime)!;
  const summary = useMemo(
    () => computeInvoiceSummary(items, discountDigits, vatRegime, invoiceType),
    [items, discountDigits, vatRegime, invoiceType],
  );

  const selectClient = (id: string) => {
    const client = INVOICE_CLIENTS.find((c) => c.id === id);
    setClientId(id);
    setClientEmail(client?.email ?? '');
    setClientSheetOpen(false);
  };

  const updateItem = (id: string, patch: Partial<InvoiceLineItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyLineItem(String(Date.now()))]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      setDatePickerOpen(false);
      return;
    }
    if (date) setDueDate(date);
    if (Platform.OS === 'android') setDatePickerOpen(false);
  };

  const dueDateLabel = dueDate
    ? dueDate.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const canPreview =
    selectedClient &&
    title.trim().length > 0 &&
    items.some((item) => item.description.trim() && lineItemValueCents(item) > 0);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 140 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SectionTitle>Informações dos clientes</SectionTitle>

        <FieldLabel>Nome do cliente</FieldLabel>
        <Pressable style={styles.selectField} onPress={() => setClientSheetOpen(true)}>
          <Text style={[styles.selectText, !selectedClient && styles.placeholder]}>
            {selectedClient?.name ?? 'Seleccionar cliente'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </Pressable>

        <FieldLabel>Endereço de e-mail do cliente</FieldLabel>
        <TextInput
          value={clientEmail}
          onChangeText={setClientEmail}
          style={styles.input}
          placeholder="email@empresa.ao"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <SectionTitle>Detalhes da factura</SectionTitle>

        <FieldLabel>Tipo de factura</FieldLabel>
        <Pressable style={styles.selectField} onPress={() => setTypeSheetOpen(true)}>
          <Text style={styles.selectText}>{selectedType.label}</Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </Pressable>
        <Text style={styles.hint}>{selectedType.description}</Text>

        <FieldLabel>Título da factura</FieldLabel>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Digite o título da factura"
          placeholderTextColor="#9CA3AF"
        />

        <FieldLabel>Moeda</FieldLabel>
        <View style={styles.selectField}>
          <View style={styles.currencyLeft}>
            <Text style={styles.flag}>🇦🇴</Text>
            <Text style={styles.selectText}>Kwanza (AOA)</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
          <Text style={styles.hint}>
            Os dados da conta {BUSINESS_PROFILE.tradeName} serão anexados à factura.
          </Text>
        </View>

        <FieldLabel>Data de vencimento</FieldLabel>
        <Pressable style={styles.selectField} onPress={() => setDatePickerOpen(true)}>
          <Text style={[styles.selectText, !dueDateLabel && styles.placeholder]}>
            {dueDateLabel || 'Seleccionar data'}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#6B7280" />
        </Pressable>

        <SectionTitle>Itens</SectionTitle>

        {items.map((item, index) => (
          <View key={item.id} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemLabel}>Item {index + 1}</Text>
              {items.length > 1 ? (
                <Pressable
                  style={styles.removeItemBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar item ${index + 1}`}
                  onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text style={styles.removeItemText}>Eliminar</Text>
                </Pressable>
              ) : null}
            </View>
            <TextInput
              value={item.description}
              onChangeText={(text) => updateItem(item.id, { description: text })}
              style={[styles.input, styles.itemDescription]}
              placeholder="Insira a descrição do item"
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <View style={styles.itemRow}>
              <View style={styles.itemCol}>
                <Text style={styles.miniLabel}>Quantidade</Text>
                <TextInput
                  value={item.quantity}
                  onChangeText={(text) =>
                    updateItem(item.id, { quantity: parseQuantityInput(text) })
                  }
                  style={[styles.input, styles.inputInRow]}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.itemCol}>
                <Text style={styles.miniLabel}>Preço</Text>
                <View style={styles.moneyField}>
                  <Text style={styles.moneyPrefix}>kz</Text>
                  <TextInput
                    value={
                      item.priceDigits
                        ? formatMoneyFromDigitsAsCents(item.priceDigits)
                        : ''
                    }
                    onChangeText={(text) =>
                      updateItem(item.id, { priceDigits: parsePriceInput(text) })
                    }
                    style={styles.moneyInput}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <View style={styles.itemCol}>
                <Text style={styles.miniLabel}>Valor</Text>
                <View style={[styles.moneyField, styles.moneyFieldReadonly]}>
                  <Text style={styles.moneyPrefix}>kz</Text>
                  <Text style={styles.readonlyValue}>
                    {formatCents(lineItemValueCents(item))}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <Pressable style={styles.addItemBtn} onPress={addItem}>
          <Text style={styles.addItemText}>Adicionar item adicional +</Text>
        </Pressable>

        <View style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>kz {summary.subtotalFormatted}</Text>
          </View>

          <View style={styles.adjustRow}>
            <Text style={styles.adjustRowLabel}>Desconto</Text>
            <View style={[styles.moneyField, styles.adjustMoneyField]}>
              <Text style={styles.moneyPrefix}>kz</Text>
              <TextInput
                value={
                  discountDigits ? formatMoneyFromDigitsAsCents(discountDigits) : ''
                }
                onChangeText={(text) => setDiscountDigits(parsePriceInput(text))}
                style={styles.moneyInput}
                placeholder="0,00"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.adjustRow}>
            <Pressable
              style={styles.adjustVatBtn}
              onPress={() => invoiceType === 'normal' && setVatSheetOpen(true)}
              disabled={invoiceType === 'simplified'}>
              <Text style={styles.adjustRowLabel} numberOfLines={1}>
                {invoiceType === 'simplified'
                  ? 'IVA isento'
                  : `IVA ${selectedVat.rate}%`}
              </Text>
              {invoiceType === 'normal' ? (
                <Ionicons name="chevron-down" size={14} color="#6B7280" />
              ) : null}
            </Pressable>
            <Text style={styles.adjustRowValue}>kz {summary.vatFormatted}</Text>
          </View>

          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>kz {summary.totalFormatted}</Text>
          </View>
        </View>

        <FieldLabel>Nota adicional</FieldLabel>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, styles.notesInput]}
          placeholder="Digite observações adicionais aqui..."
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={[styles.primaryBtn, !canPreview && styles.btnDisabled]}
          disabled={!canPreview}
          onPress={() =>
            onPreview({
              invoiceType,
              clientName: selectedClient!.name,
              clientEmail,
              title,
              dueDate,
              items,
              discountDigits,
              vatRegime,
              notes,
            })
          }>
          <Text style={styles.primaryBtnText}>Ir para a visualização</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={onSaveDraft}>
          <Text style={styles.secondaryBtnText}>Salvar como rascunho</Text>
        </Pressable>
      </View>

      <Modal visible={clientSheetOpen} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setClientSheetOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.sheetTitle}>Seleccionar cliente</Text>
          {INVOICE_CLIENTS.map((client) => (
            <Pressable key={client.id} style={styles.sheetRow} onPress={() => selectClient(client.id)}>
              <Text style={styles.sheetRowTitle}>{client.name}</Text>
              {client.email ? (
                <Text style={styles.sheetRowMeta}>{client.email}</Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      </Modal>

      <Modal visible={typeSheetOpen} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setTypeSheetOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.sheetTitle}>Tipo de factura</Text>
          {INVOICE_TYPES.map((type) => (
            <Pressable
              key={type.id}
              style={styles.sheetRow}
              onPress={() => {
                setInvoiceType(type.id);
                setTypeSheetOpen(false);
              }}>
              <Text style={styles.sheetRowTitle}>{type.label}</Text>
              <Text style={styles.sheetRowMeta}>{type.description}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>

      <Modal visible={vatSheetOpen} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setVatSheetOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.sheetTitle}>Regime de IVA</Text>
          {VAT_REGIMES.map((regime) => (
            <Pressable
              key={regime.id}
              style={styles.sheetRow}
              onPress={() => {
                setVatRegime(regime.id);
                setVatSheetOpen(false);
              }}>
              <Text style={styles.sheetRowTitle}>
                {regime.label} ({regime.rate}%)
              </Text>
            </Pressable>
          ))}
        </View>
      </Modal>

      {datePickerOpen && Platform.OS === 'android' ? (
        <DateTimePicker
          value={dueDate ?? new Date()}
          mode="date"
          minimumDate={new Date()}
          onChange={onDateChange}
        />
      ) : null}

      <Modal
        visible={datePickerOpen && Platform.OS === 'ios'}
        transparent
        animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setDatePickerOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <DateTimePicker
            value={dueDate ?? new Date()}
            mode="date"
            display="spinner"
            minimumDate={new Date()}
            onChange={onDateChange}
            locale="pt-PT"
          />
          <Pressable style={styles.dateConfirm} onPress={() => setDatePickerOpen(false)}>
            <Text style={styles.dateConfirmText}>Confirmar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 14,
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 14,
  },
  inputInRow: { marginBottom: 0 },
  selectField: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectText: { flex: 1, fontSize: 14, fontWeight: '500', color: '#111827' },
  placeholder: { color: '#9CA3AF' },
  currencyLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flag: { fontSize: 18 },
  hint: {
    flex: 1,
    marginBottom: 14,
    fontSize: 12,
    lineHeight: 17,
    color: '#9CA3AF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 14,
  },
  itemBlock: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemLabel: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  removeItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  removeItemText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },
  itemDescription: { minHeight: 72, marginBottom: 12 },
  itemRow: { flexDirection: 'row', gap: 8 },
  itemCol: { flex: 1, minWidth: 0 },
  miniLabel: { marginBottom: 6, fontSize: 12, fontWeight: '600', color: '#6B7280' },
  moneyField: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  moneyFieldReadonly: { backgroundColor: '#E5E7EB' },
  moneyPrefix: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginRight: 4 },
  moneyInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 0,
  },
  readonlyValue: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
  addItemBtn: { alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  addItemText: { fontSize: 14, fontWeight: '700', color: TEAL },
  totalsCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  totalLabel: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  totalValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  adjustRowLabel: { fontSize: 14, fontWeight: '600', color: '#374151', flexShrink: 0 },
  adjustMoneyField: { flex: 1, maxWidth: 180 },
  adjustVatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
    paddingRight: 8,
  },
  adjustRowValue: { fontSize: 14, fontWeight: '700', color: '#111827', flexShrink: 0 },
  grandTotalRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
    paddingTop: 14,
  },
  grandTotalLabel: { fontSize: 16, fontWeight: '800', color: '#111827' },
  grandTotalValue: { fontSize: 16, fontWeight: '800', color: NAVY },
  notesInput: { minHeight: 100, marginBottom: 8 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.45 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  secondaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '700', color: NAVY },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  sheetRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  sheetRowTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  sheetRowMeta: { marginTop: 3, fontSize: 12, color: '#9CA3AF' },
  dateConfirm: {
    height: 48,
    borderRadius: 24,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dateConfirmText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
