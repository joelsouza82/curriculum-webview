export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskCPF(value: string): string {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskRG(value: string): string {
  const clean = value.replace(/[^\dXx]/g, '').toUpperCase().slice(0, 9);
  return clean
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})([\dX])$/, '$1-$2');
}

export function maskCEP(value: string): string {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

export function isValidCPF(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i], 10) * (10 - i);
  }
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10) {
    firstCheck = 0;
  }
  if (firstCheck !== parseInt(cpf[9], 10)) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i], 10) * (11 - i);
  }
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10) {
    secondCheck = 0;
  }
  return secondCheck === parseInt(cpf[10], 10);
}

export function isValidRG(value: string): boolean {
  const clean = value.replace(/[^\dXx]/g, '');
  return clean.length >= 7 && clean.length <= 9;
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

export function isValidCEP(value: string): boolean {
  return onlyDigits(value).length === 8;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidBirthdate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return false;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  if (date > now) {
    return false;
  }
  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - 120);
  return date >= minDate;
}

const FIELD_ERROR_MESSAGES: Record<string, string> = {
  document: 'CPF inválido.',
  rg: 'RG inválido.',
  phone: 'Telefone inválido.',
  email: 'E-mail inválido.',
  birthdate: 'Data de nascimento inválida.',
  cep: 'CEP inválido.',
};

const FIELD_VALIDATORS: Record<string, (value: string) => boolean> = {
  document: isValidCPF,
  rg: isValidRG,
  phone: isValidPhone,
  email: isValidEmail,
  birthdate: isValidBirthdate,
  cep: isValidCEP,
};

export function validatePersonalField(field: string, value: string): string {
  const validator = FIELD_VALIDATORS[field];
  if (!validator || !value) {
    return '';
  }
  return validator(value) ? '' : FIELD_ERROR_MESSAGES[field];
}

const FIELD_MASKS: Record<string, (value: string) => string> = {
  document: maskCPF,
  rg: maskRG,
  phone: maskPhone,
  cep: maskCEP,
};

export function maskPersonalField(field: string, value: string): string {
  const mask = FIELD_MASKS[field];
  return mask ? mask(value) : value;
}
