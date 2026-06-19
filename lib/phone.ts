import { getCountryDialCode } from '@/constants/country-dial-codes';

export function sanitizePhoneDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function getPhoneMaxLength(countryCode: string) {
  return countryCode.toUpperCase() === 'AO' ? 9 : 15;
}

export function isValidSignupPhone(countryCode: string, phone: string) {
  const digits = sanitizePhoneDigits(phone);
  if (countryCode.toUpperCase() === 'AO') {
    return digits.length === 9 && digits.startsWith('9');
  }
  return digits.length >= 6;
}

export function formatSignupPhoneDisplay(countryCode: string, phone: string) {
  const dialCode = getCountryDialCode(countryCode);
  const digits = sanitizePhoneDigits(phone);
  if (!digits) return dialCode;
  return `${dialCode} ${digits}`;
}
