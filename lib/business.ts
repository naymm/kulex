import { VAT_REGIMES, type BusinessNotification, type VatRegime } from '@/constants/business';
import { getAppDataStore, patchAppDataStore } from '@/lib/data-store';
import { markBusinessNotificationReadRemote } from '@/lib/api/business';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

export function getBusinessNotifications(): BusinessNotification[] {
  return getAppDataStore().businessNotifications;
}

export function getUnreadBusinessNotificationCount(): number {
  return getBusinessNotifications().filter((item) => !item.read).length;
}

export async function markBusinessNotificationRead(id: string): Promise<void> {
  patchAppDataStore({
    businessNotifications: getAppDataStore().businessNotifications.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    ),
  });
  await markBusinessNotificationReadRemote(id);
}

export function getVatRegime(regimeId: VatRegime) {
  return VAT_REGIMES.find((item) => item.id === regimeId) ?? VAT_REGIMES[0];
}

export function computeInvoiceTotals(amountDigits: string, regimeId: VatRegime) {
  const amountCents = Number(amountDigits) || 0;
  const rate = getVatRegime(regimeId).rate;
  const vatCents = Math.round(amountCents * (rate / 100));
  const totalCents = amountCents + vatCents;

  return {
    subtotalFormatted: formatMoneyFromDigitsAsCents(amountDigits),
    vatFormatted: formatMoneyFromDigitsAsCents(String(vatCents)),
    totalFormatted: formatMoneyFromDigitsAsCents(String(totalCents)),
    rate,
  };
}
