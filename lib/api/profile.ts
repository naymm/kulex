import type { PersonalDataProfile } from '@/constants/personal-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type PersonalDataRow = {
  account_id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  nickname: string | null;
  birth_date: string | null;
  gender: string | null;
  nationality: string | null;
  id_document_type: string | null;
  id_number: string | null;
  nif: string | null;
  address: string | null;
  membership_id: string | null;
  kyc_status: string | null;
};

const MONTHS_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;

function formatBirthDate(isoDate: string | null): string {
  if (!isoDate) return '—';
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  const day = date.getDate().toString().padStart(2, '0');
  const month = MONTHS_PT[date.getMonth()] ?? '—';
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatKycStatus(status: string | null): string {
  if (!status) return 'Pendente';
  if (status === 'verificado') return 'Verificado';
  if (status === 'pendente') return 'Pendente';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function mapPersonalDataRow(
  row: PersonalDataRow,
  account: { accountType: string; membershipId: string; initials: string; color: string },
): PersonalDataProfile {
  return {
    fullName: row.full_name?.trim() || 'Utilizador Kulex',
    nickname: row.nickname?.trim() || row.full_name?.split(' ')[0] || '—',
    accountType: account.accountType,
    membershipId: row.membership_id || account.membershipId,
    initials: account.initials,
    color: account.color,
    idDocumentType: row.id_document_type?.trim() || '—',
    idNumber: row.id_number?.trim() || '—',
    nif: row.nif?.trim() || '—',
    phone: row.phone?.trim() || '—',
    email: row.email?.trim() || '—',
    address: row.address?.trim() || '—',
    birthDate: formatBirthDate(row.birth_date),
    gender: row.gender?.trim() || '—',
    nationality: row.nationality?.trim() || '—',
    kycStatus: formatKycStatus(row.kyc_status),
  };
}

export async function fetchPersonalDataProfile(
  accountId: string,
  account: { accountType: string; membershipId: string; initials: string; color: string },
): Promise<PersonalDataProfile | null> {
  if (!isSupabaseConfigured || !accountId) return null;

  const { data, error } = await supabase
    .from('personal_data_profiles')
    .select(
      'account_id, email, phone, full_name, nickname, birth_date, gender, nationality, id_document_type, id_number, nif, address, membership_id, kyc_status',
    )
    .eq('account_id', accountId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapPersonalDataRow(data as PersonalDataRow, account);
}
