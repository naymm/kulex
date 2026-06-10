import { getAccountById } from '@/constants/accounts';

export type PersonalDataField = {
  id: string;
  label: string;
  value: string;
};

export type PersonalDataSection = {
  id: string;
  title: string;
  fields: PersonalDataField[];
};

export type PersonalDataProfile = {
  fullName: string;
  nickname: string;
  accountType: string;
  membershipId: string;
  avatar?: number;
  initials: string;
  color: string;
  idDocumentType: string;
  idNumber: string;
  nif: string;
  phone: string;
  email: string;
  address: string;
  birthDate: string;
  gender: string;
  nationality: string;
  kycStatus: string;
};

const PERSONAL_DATA_BY_ACCOUNT: Record<string, PersonalDataProfile> = {
  'naym-personal': {
    fullName: 'Naym Mupoia',
    nickname: 'Naym',
    accountType: 'Conta Pessoal',
    membershipId: 'KLX-48291037',
    avatar: getAccountById('naym-personal').avatar,
    initials: 'NM',
    color: '#2FB7A9',
    idDocumentType: 'Bilhete de Identidade Nacional',
    idNumber: '005853642LN048',
    nif: '005853642LN048',
    phone: '+244 944 781 378',
    email: 'naymupoia@gmail.com',
    address: 'Rua Marien Ngouambi, Luanda',
    birthDate: '04 Abril 2001',
    gender: 'Masculino',
    nationality: 'Angolana',
    kycStatus: 'Verificado',
  },
  'naym-agent': {
    fullName: 'Naym Mupoia',
    nickname: 'Naym',
    accountType: 'Conta Agente',
    membershipId: 'KLX-39102756',
    initials: 'NA',
    color: '#C9A227',
    idDocumentType: 'Bilhete de Identidade Nacional',
    idNumber: '005853642LN048',
    nif: '005853642LN048',
    phone: '+244 944 781 378',
    email: 'agente.naym@kulex.ao',
    address: 'Rua Marien Ngouambi, Luanda',
    birthDate: '04 Abril 2001',
    gender: 'Masculino',
    nationality: 'Angolana',
    kycStatus: 'Verificado',
  },
  'kulex-business': {
    fullName: 'Kulex Negócios Lda',
    nickname: 'Kulex',
    accountType: 'Conta Empresa',
    membershipId: 'KLX-77204519',
    initials: 'KN',
    color: '#1A1A4E',
    idDocumentType: 'Certidão Comercial',
    idNumber: 'AO-2024-118293',
    nif: '541902873LA041',
    phone: '+244 222 456 789',
    email: 'contacto@kulexnegocios.ao',
    address: 'Av. 4 de Fevereiro, Luanda',
    birthDate: '—',
    gender: '—',
    nationality: 'Angolana',
    kycStatus: 'Verificado',
  },
};

export function getPersonalData(accountId: string): PersonalDataProfile {
  return PERSONAL_DATA_BY_ACCOUNT[accountId] ?? PERSONAL_DATA_BY_ACCOUNT['naym-personal'];
}

export function getPersonalDataSections(accountId: string): PersonalDataSection[] {
  const data = getPersonalData(accountId);

  return [
    {
      id: 'identificacao',
      title: 'Identificação',
      fields: [
        { id: 'doc-type', label: 'Tipo de documento', value: data.idDocumentType },
        { id: 'doc-number', label: 'Número do documento', value: data.idNumber },
        { id: 'nif', label: 'NIF', value: data.nif },
        { id: 'nationality', label: 'Nacionalidade', value: data.nationality },
      ],
    },
    {
      id: 'contacto',
      title: 'Contacto',
      fields: [
        { id: 'phone', label: 'Telefone', value: data.phone },
        { id: 'email', label: 'E-mail', value: data.email },
        { id: 'address', label: 'Morada', value: data.address },
      ],
    },
    {
      id: 'pessoal',
      title: 'Informação pessoal',
      fields: [
        { id: 'full-name', label: 'Nome completo', value: data.fullName },
        { id: 'nickname', label: 'Apelido', value: data.nickname },
        { id: 'birth-date', label: 'Data de nascimento', value: data.birthDate },
        { id: 'gender', label: 'Género', value: data.gender },
      ],
    },
    {
      id: 'conta',
      title: 'Conta Kulex',
      fields: [
        { id: 'account-type', label: 'Tipo de conta', value: data.accountType },
        { id: 'membership', label: 'ID Kulex', value: data.membershipId },
        { id: 'kyc', label: 'Estado KYC', value: data.kycStatus },
      ],
    },
  ];
}

/** @deprecated Use getPersonalData(activeAccountId) */
export const PERSONAL_DATA = getPersonalData('naym-personal');

/** @deprecated Use getPersonalDataSections(activeAccountId) */
export const PERSONAL_DATA_SECTIONS = getPersonalDataSections('naym-personal');
