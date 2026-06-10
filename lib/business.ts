import {
  BUSINESS_NOTIFICATIONS,
  VAT_REGIMES,
  type BusinessNotification,
  type VatRegime,
} from '@/constants/business';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

let notifications = [...BUSINESS_NOTIFICATIONS];

export function getBusinessNotifications(): BusinessNotification[] {
  return notifications;
}

export function getUnreadBusinessNotificationCount(): number {
  return notifications.filter((item) => !item.read).length;
}

export function markBusinessNotificationRead(id: string): void {
  notifications = notifications.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
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
