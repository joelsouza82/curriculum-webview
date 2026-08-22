type InputProps = {
  type: string;
  maxLength?: number;
  inputMode?: 'numeric' | 'tel' | 'email' | 'text';
  placeholder?: string;
};

export function getFieldInputProps(field: string): InputProps {
  switch (field) {
    case 'birthdate':
      return { type: 'date' };
    case 'document':
      return { type: 'text', maxLength: 14, inputMode: 'numeric', placeholder: '000.000.000-00' };
    case 'rg':
      return { type: 'text', maxLength: 12, placeholder: '00.000.000-0' };
    case 'phone':
      return { type: 'text', maxLength: 15, inputMode: 'tel', placeholder: '(00) 00000-0000' };
    case 'cep':
      return { type: 'text', maxLength: 9, inputMode: 'numeric', placeholder: '00000-000' };
    case 'email':
      return { type: 'email', placeholder: 'seuemail@exemplo.com' };
    default:
      return { type: 'text' };
  }
}
