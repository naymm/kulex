import type { AccountKind } from '@/constants/accounts';

function capitalizeWord(word: string): string {
  const trimmed = word.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toLocaleUpperCase('pt-PT') + trimmed.slice(1).toLocaleLowerCase('pt-PT');
}

/** Ex.: "NAYM PORFIRIO MARQUES MUPOIA" → "Naym Mupoia" */
export function formatDisplayName(name: string, kind: AccountKind = 'personal'): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';

  if (kind === 'business' || parts.length <= 2) {
    return parts.map(capitalizeWord).join(' ');
  }

  return `${capitalizeWord(parts[0])} ${capitalizeWord(parts[parts.length - 1])}`;
}
