import {
  isValidBirthdate,
  isValidCPF,
  isValidEmail,
  isValidPhone,
  isValidRG,
  maskCPF,
  maskPersonalField,
  maskPhone,
  maskRG,
  validatePersonalField,
} from './validation';

describe('masks', () => {
  it('formats a CPF as it is typed', () => {
    expect(maskCPF('111')).toBe('111');
    expect(maskCPF('1114447773')).toBe('111.444.777-3');
    expect(maskCPF('11144477735')).toBe('111.444.777-35');
    expect(maskCPF('111.444.777-35extra')).toBe('111.444.777-35');
  });

  it('formats an RG as it is typed', () => {
    expect(maskRG('123456789')).toBe('12.345.678-9');
    expect(maskRG('12345678x')).toBe('12.345.678-X');
  });

  it('formats a phone number for landlines and mobiles', () => {
    expect(maskPhone('1123456789')).toBe('(11) 2345-6789');
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('maskPersonalField only masks known fields', () => {
    expect(maskPersonalField('document', '11144477735')).toBe('111.444.777-35');
    expect(maskPersonalField('name', 'John Doe')).toBe('John Doe');
  });
});

describe('validators', () => {
  it('validates CPF checksum', () => {
    expect(isValidCPF('111.444.777-35')).toBe(true);
    expect(isValidCPF('111.444.777-36')).toBe(false);
    expect(isValidCPF('111.111.111-11')).toBe(false);
    expect(isValidCPF('123')).toBe(false);
  });

  it('validates RG by digit count', () => {
    expect(isValidRG('12.345.678-9')).toBe(true);
    expect(isValidRG('123')).toBe(false);
  });

  it('validates phone by digit count', () => {
    expect(isValidPhone('(11) 2345-6789')).toBe(true);
    expect(isValidPhone('(11) 98765-4321')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
  });

  it('validates email format', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  it('validates birthdate is a real, non-future date', () => {
    expect(isValidBirthdate('2000-01-31')).toBe(true);
    expect(isValidBirthdate('2999-01-01')).toBe(false);
    expect(isValidBirthdate('not-a-date')).toBe(false);
  });
});

describe('validatePersonalField', () => {
  it('returns no error for empty values', () => {
    expect(validatePersonalField('email', '')).toBe('');
  });

  it('returns an error message for invalid values', () => {
    expect(validatePersonalField('email', 'invalid')).toBe('E-mail inválido.');
    expect(validatePersonalField('document', '123')).toBe('CPF inválido.');
  });

  it('returns empty string for fields without a validator', () => {
    expect(validatePersonalField('name', 'anything')).toBe('');
  });
});
