import { VAT_REGIMES, type InvoiceType, type VatRegime } from '@/constants/business';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: string;
  priceDigits: string;
};

export type InvoiceDraft = {
  invoiceType: InvoiceType;
  clientId: string | null;
  clientEmail: string;
  title: string;
  dueDate: Date | null;
  items: InvoiceLineItem[];
  discountDigits: string;
  vatRegime: VatRegime;
  notes: string;
};

export type InvoicePreviewPayload = {
  invoiceType: InvoiceType;
  clientName: string;
  clientEmail: string;
  title: string;
  dueDate: string | null;
  items: InvoiceLineItem[];
  discountDigits: string;
  vatRegime: VatRegime;
  notes: string;
};

export function createEmptyLineItem(id = '1'): InvoiceLineItem {
  return { id, description: '', quantity: '', priceDigits: '' };
}

export function lineItemValueCents(item: InvoiceLineItem): number {
  const qty = Number(item.quantity) || 0;
  const priceCents = Number(item.priceDigits) || 0;
  return Math.round(qty * priceCents);
}

export function formatCents(cents: number): string {
  return formatMoneyFromDigitsAsCents(String(Math.max(0, cents)));
}

export function computeInvoiceSummary(
  items: InvoiceLineItem[],
  discountDigits: string,
  vatRegime: VatRegime,
  invoiceType: InvoiceType,
) {
  const subtotalCents = items.reduce((sum, item) => sum + lineItemValueCents(item), 0);
  const discountCents = Number(discountDigits) || 0;
  const taxableCents = Math.max(0, subtotalCents - discountCents);
  const rate =
    invoiceType === 'simplified'
      ? 0
      : (VAT_REGIMES.find((item) => item.id === vatRegime)?.rate ?? 0);
  const vatCents = Math.round(taxableCents * (rate / 100));
  const totalCents = taxableCents + vatCents;

  return {
    subtotalCents,
    discountCents,
    taxableCents,
    vatCents,
    totalCents,
    rate,
    subtotalFormatted: formatCents(subtotalCents),
    discountFormatted: formatCents(discountCents),
    vatFormatted: formatCents(vatCents),
    totalFormatted: formatCents(totalCents),
  };
}

export function parsePriceInput(text: string): string {
  const digits = text.replace(/[^\d]/g, '').slice(0, 12);
  return digits;
}

export function parseQuantityInput(text: string): string {
  return text.replace(/[^\d]/g, '').slice(0, 6);
}
