import { getFieldInputProps } from './fieldInput';

describe('getFieldInputProps', () => {
  it('returns a date input for birthdate', () => {
    expect(getFieldInputProps('birthdate')).toEqual({ type: 'date' });
  });

  it('returns a numeric text input with mask placeholder for document', () => {
    expect(getFieldInputProps('document')).toEqual({
      type: 'text',
      maxLength: 14,
      inputMode: 'numeric',
      placeholder: '000.000.000-00',
    });
  });

  it('returns a text input with mask placeholder for rg', () => {
    expect(getFieldInputProps('rg')).toEqual({
      type: 'text',
      maxLength: 12,
      placeholder: '00.000.000-0',
    });
  });

  it('returns a tel input with mask placeholder for phone', () => {
    expect(getFieldInputProps('phone')).toEqual({
      type: 'text',
      maxLength: 15,
      inputMode: 'tel',
      placeholder: '(00) 00000-0000',
    });
  });

  it('returns an email input for email', () => {
    expect(getFieldInputProps('email')).toEqual({
      type: 'email',
      placeholder: 'seuemail@exemplo.com',
    });
  });

  it('returns a plain text input for fields without special handling', () => {
    expect(getFieldInputProps('name')).toEqual({ type: 'text' });
    expect(getFieldInputProps('address')).toEqual({ type: 'text' });
    expect(getFieldInputProps('unknown-field')).toEqual({ type: 'text' });
  });
});
