import { PERSONAL_FIELD_LABELS } from './constants';

describe('PERSONAL_FIELD_LABELS', () => {
  it('provides a label for every editable Personal field', () => {
    const expectedKeys = [
      'name',
      'rg',
      'document',
      'address',
      'neighborhood',
      'city',
      'state',
      'cep',
      'phone',
      'email',
      'website',
      'linkedin',
      'github',
      'birthdate',
    ];

    expect(Object.keys(PERSONAL_FIELD_LABELS).sort()).toEqual(expectedKeys.sort());
  });

  it('does not include id_personal or login_id', () => {
    expect(PERSONAL_FIELD_LABELS).not.toHaveProperty('id_personal');
    expect(PERSONAL_FIELD_LABELS).not.toHaveProperty('login_id');
  });

  it('every label is a non-empty string', () => {
    Object.values(PERSONAL_FIELD_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });
});
