import { Personal } from '../types/personal';

/**
 * Converte uma data "YYYY-MM-DD" (formato do <input type="date">) para
 * RFC3339, formato exigido pela API. Deixa outros formatos inalterados.
 */
function toRFC3339(date?: string): string | undefined {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return `${date}T00:00:00Z`;
  }
  return date;
}

/**
 * Busca todos os registros pessoais.
 */
export async function getPersonals() {
  try {
    const response = await fetch('/api/personals', {
      cache: 'no-store',
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching personals:', error);
    throw error;
  }
}

/**
 * Cria um novo registro pessoal.
 */
export async function createPersonal(data: Omit<Personal, 'id_personal'>): Promise<Personal> {
  try {
    const response = await fetch('/api/personal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        birthdate: toRFC3339(data.birthdate),
        login_id: Number(data.login_id),
      }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error creating personal:', error);
    throw error;
  }
}

/**
 * Atualiza os dados de um registro pessoal.
 */
export async function updatePersonal(id: string, data: Partial<Personal>): Promise<Personal> {
  try {
    const response = await fetch(`/api/personal/${id}`, { // Usando o endpoint do proxy
      method: 'PUT', // Ou 'PATCH', dependendo da sua API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        birthdate: toRFC3339(data.birthdate),
        login_id: data.login_id !== undefined ? Number(data.login_id) : data.login_id,
      }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error updating personal with ID ${id}:`, error);
    throw error;
  }
}