import { Asset } from 'expo-asset';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { Alert, Platform } from 'react-native';
import type { Contact } from '@/constants/contacts';
import { KWIK_CONFIRM_KEY_LABELS, KWIK_SOURCE_ACCOUNT } from '@/constants/kwik';
import { getPersonalData } from '@/constants/personal-data';
import { BANK_SUCCESS_NOTE, BANK_TRANSACTION_REF } from '@/constants/withdraw';
import type { BankTransferParams } from '@/lib/bank-transfer';
import { formatIbanDisplay } from '@/lib/iban';
import { formatKwikKeyDisplay, type KwikTransferParams } from '@/lib/kwik';
import { getTransferAccounts, type MyAccountsTransferParams } from '@/lib/my-accounts';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

export type TransferReceiptRow = { label: string; value: string };

export type TransferReceiptSection = {
  title: string;
  rows: TransferReceiptRow[];
};

export type TransferReceiptData = {
  generatedAt: Date;
  valueDate: string;
  operationDate: string;
  availableDate: string;
  status: string;
  transferSection: TransferReceiptSection;
  beneficiarySection: TransferReceiptSection;
  note?: string;
};

const BANK_COMMISSION = '350,00 kz';
const BANK_IVA = '49,00 kz';
const ZERO_FEE = '0,00 kz';

const CM_TO_PT = 72 / 2.54;

/** Margens do comprovativo PDF: superior/inferior 2,5 cm; esquerda/direita 3 cm. */
export const RECEIPT_PAGE_MARGINS = {
  top: '1cm',
  right: '1cm',
  bottom: '1cm',
  left: '1cm',
} as const;

const RECEIPT_PAGE_MARGINS_PT = {
  top: 1 * CM_TO_PT,
  right: 1 * CM_TO_PT,
  bottom: 1 * CM_TO_PT,
  left: 1 * CM_TO_PT,
};

const RECEIPT_LOGO = require('@/assets/images/logoblack.png');

let cachedReceiptLogoDataUri: string | null = null;

async function getReceiptLogoDataUri(): Promise<string> {
  if (cachedReceiptLogoDataUri) {
    return cachedReceiptLogoDataUri;
  }

  const asset = Asset.fromModule(RECEIPT_LOGO);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error('Não foi possível carregar o logo Kulex.');
  }

  const base64 = await readAsStringAsync(asset.localUri, {
    encoding: EncodingType.Base64,
  });

  cachedReceiptLogoDataUri = `data:image/png;base64,${base64}`;
  return cachedReceiptLogoDataUri;
}

export function formatTransferReceiptDate(date: Date = new Date()): string {
  const datePart = date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return `${datePart}, ${timePart}`;
}

function formatReceiptIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatReceiptDisplayDate(date: Date): string {
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }

  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateTransferReference(): string {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
  return `KLX-${stamp}`;
}

function generateOperationId(): string {
  const segment = () =>
    Math.floor(Math.random() * 0x10000)
      .toString(16)
      .padStart(4, '0');
  return `${segment()}${segment()}-${segment()}-${segment()}-${segment()}-${segment()}${segment()}${segment()}`;
}

function formatAmountKz(amountDigits: string): string {
  return `${formatMoneyFromDigitsAsCents(amountDigits)} kz`;
}

function getSenderProfile() {
  const profile = getPersonalData('naym-personal');
  return {
    name: profile.fullName.toUpperCase(),
    address: `${profile.address}, Angola`,
    membershipId: profile.membershipId,
  };
}

function buildReceiptMeta(generatedAt: Date, availableOffsetDays = 0): Pick<
  TransferReceiptData,
  'generatedAt' | 'valueDate' | 'operationDate' | 'availableDate' | 'status'
> {
  const availableDate =
    availableOffsetDays > 0
      ? formatReceiptIsoDate(addBusinessDays(generatedAt, availableOffsetDays))
      : formatReceiptIsoDate(generatedAt);

  return {
    generatedAt,
    valueDate: formatReceiptIsoDate(generatedAt),
    operationDate: formatReceiptIsoDate(generatedAt),
    availableDate,
    status: 'Concluído',
  };
}

function buildTransferRows(
  amountDigits: string,
  options: {
    commission?: string;
    iva?: string;
    transferIdLabel: string;
    transferId: string;
    reference: string;
    operationId: string;
    extraRows?: TransferReceiptRow[];
  },
): TransferReceiptRow[] {
  const rows: TransferReceiptRow[] = [
    { label: 'Montante', value: formatAmountKz(amountDigits) },
    { label: 'Comissão', value: options.commission ?? ZERO_FEE },
  ];

  if (options.iva) {
    rows.push({ label: 'IVA', value: options.iva });
  }

  rows.push(
    { label: options.transferIdLabel, value: options.transferId },
    { label: 'Referência da operação', value: options.reference },
    { label: 'ID da operação', value: options.operationId },
  );

  if (options.extraRows?.length) {
    rows.push(...options.extraRows);
  }

  return rows;
}

function renderSection(section: TransferReceiptSection): string {
  const rowsHtml = section.rows
    .map(
      (row, index) => `
        <tr class="${index % 2 === 0 ? 'row-even' : 'row-odd'}">
          <td class="label">${escapeHtml(row.label)}</td>
          <td class="value">${escapeHtml(row.value)}</td>
        </tr>`,
    )
    .join('');

  return `
    <div class="section">
      <div class="section-header">${escapeHtml(section.title)}</div>
      <table class="data-table">
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;
}

function buildQrPlaceholder(reference: string): string {
  const seed = escapeHtml(reference.slice(-8));
  return `
    <svg viewBox="0 0 80 80" width="72" height="72" aria-hidden="true">
      <rect width="80" height="80" fill="#FFFFFF" stroke="#111111" stroke-width="2"/>
      <rect x="8" y="8" width="18" height="18" fill="#111111"/>
      <rect x="54" y="8" width="18" height="18" fill="#111111"/>
      <rect x="8" y="54" width="18" height="18" fill="#111111"/>
      <rect x="34" y="34" width="8" height="8" fill="#111111"/>
      <rect x="48" y="48" width="10" height="10" fill="#111111"/>
      <rect x="30" y="12" width="6" height="6" fill="#111111"/>
      <rect x="12" y="30" width="6" height="6" fill="#111111"/>
      <rect x="58" y="30" width="6" height="6" fill="#111111"/>
      <text x="40" y="76" text-anchor="middle" font-size="7" fill="#666666">${seed}</text>
    </svg>`;
}

export function buildTransferReceiptHtml(
  data: TransferReceiptData,
  logoDataUri: string,
): string {
  const sender = getSenderProfile();
  const reference =
    data.transferSection.rows.find((row) => row.label === 'Referência da operação')?.value ??
    generateTransferReference();
  const generatedLabel = formatReceiptDisplayDate(data.generatedAt);

  const metaRows = [
    { label: 'Data-valor', value: data.valueDate },
    { label: 'Data da Operação', value: data.operationDate },
    { label: 'Data disponível', value: data.availableDate },
    { label: 'Estado', value: data.status, bold: true },
  ];

  const metaHtml = metaRows
    .map(
      (row) => `
        <tr>
          <td class="meta-label">${escapeHtml(row.label)}</td>
          <td class="meta-value${row.bold ? ' meta-bold' : ''}">${escapeHtml(row.value)}</td>
        </tr>`,
    )
    .join('');

  const noteHtml = data.note
    ? `<div class="note-box">${escapeHtml(data.note)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @page {
        margin: ${RECEIPT_PAGE_MARGINS.top} ${RECEIPT_PAGE_MARGINS.right} ${RECEIPT_PAGE_MARGINS.bottom} ${RECEIPT_PAGE_MARGINS.left};
      }
      body {
        font-family: Helvetica, Arial, sans-serif;
        color: #111111;
        background: #ffffff;
        font-size: 11px;
        line-height: 1.45;
      }
      .page {
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
        margin-bottom: 28px;
      }
      .header-left { width: 42%; }
      .brand-logo {
        height: 32px;
        width: auto;
        margin-bottom: 18px;
        display: block;
      }
      .sender-name {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2px;
        margin-bottom: 4px;
      }
      .sender-address {
        font-size: 10px;
        color: #333333;
        max-width: 240px;
      }
      .header-right {
        width: 52%;
        text-align: right;
      }
      .doc-title {
        font-size: 24px;
        font-weight: 700;
        line-height: 1.15;
        margin-bottom: 6px;
      }
      .generated-at {
        font-size: 10px;
        color: #333333;
        margin-bottom: 14px;
      }
      .meta-table {
        width: 100%;
        border-collapse: collapse;
        margin-left: auto;
      }
      .meta-table td {
        padding: 3px 0;
        font-size: 10px;
        vertical-align: top;
      }
      .meta-label {
        color: #333333;
        text-align: left;
        width: 58%;
        padding-right: 12px;
      }
      .meta-value {
        text-align: right;
        color: #111111;
      }
      .meta-bold { font-weight: 700; }
      .section { margin-bottom: 18px; }
      .section-header {
        background: #ECECEC;
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 700;
        border: 1px solid #D9D9D9;
        border-bottom: none;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #D9D9D9;
      }
      .data-table td {
        padding: 9px 12px;
        font-size: 10px;
        vertical-align: top;
        border-bottom: 1px solid #E5E5E5;
      }
      .data-table tr:last-child td { border-bottom: none; }
      .row-even { background: #FFFFFF; }
      .row-odd { background: #FAFAFA; }
      .label {
        width: 46%;
        color: #222222;
      }
      .value {
        text-align: right;
        color: #111111;
        font-weight: 500;
        word-break: break-word;
      }
      .note-box {
        margin: 8px 0 18px;
        padding: 10px 12px;
        border: 1px solid #E5E5E5;
        background: #FAFAFA;
        font-size: 10px;
        color: #444444;
      }
      .footer {
        margin-top: auto;
        padding-top: 22px;
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: flex-start;
      }
      .footer-left { width: 34%; }
      .footer-right { width: 62%; }
      .support-title {
        font-size: 10px;
        font-weight: 700;
        margin-top: 10px;
      }
      .support-text {
        font-size: 9px;
        color: #333333;
        margin-top: 2px;
      }
      .copyright {
        margin-top: 10px;
        font-size: 9px;
        color: #666666;
      }
      .legal {
        font-size: 8px;
        color: #666666;
        line-height: 1.5;
        text-align: justify;
      }
      .page-number {
        margin-top: 12px;
        font-size: 9px;
        color: #666666;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="header-left">
          <img src="${logoDataUri}" alt="Kulex" class="brand-logo" />
          <div class="sender-name">${escapeHtml(sender.name)}</div>
          <div class="sender-address">${escapeHtml(sender.address)}</div>
        </div>
        <div class="header-right">
          <div class="doc-title">Comprovativo de transferência</div>
          <div class="generated-at">Gerado a ${escapeHtml(generatedLabel)}</div>
          <table class="meta-table">${metaHtml}</table>
        </div>
      </div>

      ${renderSection(data.transferSection)}
      ${renderSection(data.beneficiarySection)}
      ${noteHtml}

      <div class="footer">
        <div class="footer-left">
          ${buildQrPlaceholder(reference)}
          <div class="support-title">Comunicar perda ou roubo do cartão</div>
          <div class="support-text">+244 923 000 000 (24h)</div>
          <div class="support-title">Obter ajuda directamente na app</div>
          <div class="support-text">Leia o código QR ou contacte o suporte Kulex.</div>
          <div class="copyright">© ${data.generatedAt.getFullYear()} Kulex S.A. Angola</div>
        </div>
        <div class="footer-right">
          <p class="legal">
            Este documento comprova a execução da operação de transferência indicada.
            A Kulex S.A. regista a operação com a referência e ID apresentados.
            Guarde este comprovativo para consulta futura. Em caso de discrepância,
            contacte o apoio ao cliente dentro de 30 dias, indicando a referência da operação.
            Operações bancárias podem demorar até 48 horas para conclusão definitiva.
          </p>
          <div class="page-number">Página 1 de 1</div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

export async function shareTransferReceiptPdf(data: TransferReceiptData): Promise<void> {
  if (Platform.OS === 'web') {
    Alert.alert('Indisponível', 'A partilha do comprovante não está disponível na versão web.');
    return;
  }

  const logoDataUri = await getReceiptLogoDataUri();
  const html = buildTransferReceiptHtml(data, logoDataUri);
  const { uri } = await Print.printToFileAsync({
    html,
    margins: RECEIPT_PAGE_MARGINS_PT,
  });
  const available = await Sharing.isAvailableAsync();

  if (!available) {
    Alert.alert('Indisponível', 'A partilha não está disponível neste dispositivo.');
    return;
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: 'Partilhar comprovante',
  });
}

export function buildContactTransferReceipt(
  contact: Contact,
  amountDigits: string,
  generatedAt: Date = new Date(),
): TransferReceiptData {
  const reference = generateTransferReference();
  const operationId = generateOperationId();

  return {
    ...buildReceiptMeta(generatedAt),
    transferSection: {
      title: 'Dados da transferência',
      rows: buildTransferRows(amountDigits, {
        transferIdLabel: 'ID de Transferência Kulex',
        transferId: reference,
        reference,
        operationId,
        extraRows: [{ label: 'Tipo', value: 'Transferência para contacto' }],
      }),
    },
    beneficiarySection: {
      title: 'Dados do Beneficiário',
      rows: [
        { label: 'Nome', value: contact.name },
        { label: 'Telemóvel', value: contact.phone },
      ],
    },
  };
}

export function buildMyAccountsTransferReceipt(
  params: MyAccountsTransferParams,
  generatedAt: Date = new Date(),
): TransferReceiptData {
  const { fromAccount, toAccount } = getTransferAccounts(params);
  const reference = generateTransferReference();
  const operationId = generateOperationId();

  return {
    ...buildReceiptMeta(generatedAt),
    transferSection: {
      title: 'Dados da transferência',
      rows: buildTransferRows(params.amount ?? '', {
        transferIdLabel: 'ID de Transferência Interna',
        transferId: reference,
        reference,
        operationId,
        extraRows: [
          { label: 'Tipo', value: 'Transferência entre contas' },
          { label: 'Conta de origem', value: fromAccount.name },
        ],
      }),
    },
    beneficiarySection: {
      title: 'Dados do Beneficiário',
      rows: [
        { label: 'Conta de destino', value: toAccount.name },
        { label: 'Titular', value: getSenderProfile().name },
      ],
    },
  };
}

export function buildBankTransferReceipt(
  params: BankTransferParams,
  generatedAt: Date = new Date(),
): TransferReceiptData {
  const reference = BANK_TRANSACTION_REF;
  const operationId = generateOperationId();
  const iban = formatIbanDisplay(params.iban) || '—';
  const beneficiary = (params.titular || '—').trim().toUpperCase() || '—';

  return {
    ...buildReceiptMeta(generatedAt, 2),
    transferSection: {
      title: 'Dados da transferência',
      rows: buildTransferRows(params.amount ?? '', {
        commission: BANK_COMMISSION,
        iva: BANK_IVA,
        transferIdLabel: 'ID de Transferência Bancária',
        transferId: reference,
        reference,
        operationId,
        extraRows: [{ label: 'Tipo', value: 'Transferência bancária' }],
      }),
    },
    beneficiarySection: {
      title: 'Dados do Beneficiário',
      rows: [
        { label: 'Nome', value: beneficiary },
        { label: 'Número de conta', value: iban },
        { label: 'Banco', value: params.bank || '—' },
      ],
    },
    note: BANK_SUCCESS_NOTE,
  };
}

export function buildKwikTransferReceipt(
  params: KwikTransferParams,
  generatedAt: Date = new Date(),
): TransferReceiptData {
  const reference = generateTransferReference();
  const operationId = generateOperationId();
  const keyDisplay = formatKwikKeyDisplay(params.keyType, params.kwikKey) || '—';

  return {
    ...buildReceiptMeta(generatedAt),
    transferSection: {
      title: 'Dados da transferência',
      rows: buildTransferRows(params.amount ?? '', {
        transferIdLabel: 'ID de Transferência KWiK',
        transferId: reference,
        reference,
        operationId,
        extraRows: [
          { label: 'Tipo', value: 'Transferência KWiK' },
          { label: 'Conta de origem', value: KWIK_SOURCE_ACCOUNT },
          { label: 'Descrição pessoal', value: params.personalDesc || '—' },
          { label: 'Descrição destino', value: params.destDesc || '—' },
        ],
      }),
    },
    beneficiarySection: {
      title: 'Dados do Beneficiário',
      rows: [
        { label: 'Nome', value: params.beneficiary || '—' },
        { label: KWIK_CONFIRM_KEY_LABELS[params.keyType], value: keyDisplay },
      ],
    },
  };
}
