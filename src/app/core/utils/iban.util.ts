export function normalizeIban(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function isValidIban(value: string): boolean {
  const normalized = normalizeIban(value);
  if (normalized.length < 15 || normalized.length > 34) return false;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) return false;

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
