import {
  formatIban,
  formattedIbanLength,
  ibanLengthFor,
  isValidIban,
  normalizeIban,
} from './iban.util';

describe('IBAN utilities', () => {
  it('normalizes pasted separators and lowercase letters', () => {
    expect(normalizeIban('es91-2100 0418.4502 0005 1332')).toBe('ES9121000418450200051332');
  });

  it('formats the value in readable groups and caps it to the detected country', () => {
    expect(formatIban('es91210004184502000513329999')).toBe('ES91 2100 0418 4502 0005 1332');
  });

  it('uses the country-specific length and falls back to the IBAN maximum', () => {
    expect(ibanLengthFor('ES')).toBe(24);
    expect(ibanLengthFor('GB')).toBe(22);
    expect(ibanLengthFor('ZZ')).toBe(34);
    expect(formattedIbanLength(24)).toBe(29);
  });

  it('validates both the checksum and the country-specific length', () => {
    expect(isValidIban('ES91 2100 0418 4502 0005 1332')).toBeTrue();
    expect(isValidIban('ES91 2100 0418 4502 0005')).toBeFalse();
  });
});
