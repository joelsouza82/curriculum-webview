import { Personal } from '../types/personal';

export const PERSONAL_FIELD_LABELS: Record<keyof Omit<Personal, 'id_personal' | 'login_id'>, string> = {
  name: 'Nome completo',
  rg: 'RG',
  document: 'CPF',
  address: 'Endereço',
  neighborhood: 'Bairro',
  city: 'Cidade',
  state: 'Estado',
  cep: 'CEP',
  phone: 'Telefone',
  email: 'E-mail',
  website: 'Site',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  birthdate: 'Data de nascimento',
};
