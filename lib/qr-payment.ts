export type QrPaymentPayload = {
  merchant: string;
  amountDigits: string;
};

export function parseQrPaymentPayload(data: string): QrPaymentPayload | null {
  const trimmed = data.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.startsWith('{')) {
      const json = JSON.parse(trimmed) as { merchant?: string; amount?: string | number };
      if (json.merchant && json.amount != null) {
        return {
          merchant: json.merchant,
          amountDigits: String(json.amount).replace(/\D/g, ''),
        };
      }
    }

    const normalized = trimmed.includes('://') ? trimmed : `https://kulex.local/${trimmed}`;
    const url = new URL(normalized.replace(/^kulex:\/\//, 'https://kulex.local/'));
    const merchant = url.searchParams.get('merchant');
    const amount = url.searchParams.get('amount');
    if (merchant && amount) {
      return {
        merchant: decodeURIComponent(merchant),
        amountDigits: amount.replace(/\D/g, ''),
      };
    }
  } catch {
    return null;
  }

  return null;
}
