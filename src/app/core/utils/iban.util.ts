/** Known national IBAN lengths; unknown prefixes retain the generic IBAN maximum. */
const IBAN_LENGTHS: Readonly<Record<string, number>> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22,
  BH: 22, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22,
  DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27,
  GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28,
  IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20,
  LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24,
  ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, OM: 23,
  PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24,
  SC: 31, SE: 24, SI: 19, SK: 24, SM: 27, ST: 25, SV: 28, TL: 23,
  TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20,
};

export const MAX_IBAN_LENGTH = 34;

export function normalizeIban(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/** Returns the exact country length once a known two-letter prefix is available. */
export function ibanLengthFor(value: string): number {
  const countryCode = normalizeIban(value).slice(0, 2);
  return IBAN_LENGTHS[countryCode] ?? MAX_IBAN_LENGTH;
}

/** Makes an IBAN readable while keeping its normalized length within the country limit. */
export function formatIban(value: string, maxLength = ibanLengthFor(value)): string {
  const normalized = normalizeIban(value).slice(0, maxLength);
  return normalized.match(/.{1,4}/g)?.join(' ') ?? '';
}

/** The HTML maxlength equivalent for an IBAN displayed in groups of four. */
export function formattedIbanLength(rawLength: number): number {
  return rawLength + Math.floor((rawLength - 1) / 4);
}

export function isValidIban(value: string): boolean {
  const normalized = normalizeIban(value);
  if (normalized.length < 15 || normalized.length > 34) return false;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) return false;

  const countryLength = IBAN_LENGTHS[normalized.slice(0, 2)];
  if (countryLength && normalized.length !== countryLength) return false;

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  let remainder = 0;

  for (const char of rearranged) {
    if (/\d/.test(char)) {
      remainder = (remainder * 10 + Number(char)) % 97;
    } else {
      const valueForLetter = char.charCodeAt(0) - 55;
      remainder = (remainder * 100 + valueForLetter) % 97;
    }
  }

  return remainder === 1;
}

export function maskIban(value: string | null): string {
  if (!value) return '—';
  if (value.includes('*')) return value;

  const normalized = normalizeIban(value);
  if (normalized.length <= 4) return '*'.repeat(normalized.length);

  return `********${normalized.slice(-4)}`;
}
