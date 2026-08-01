import { Personal } from '../types/personal';

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
 * Busca os dados de um único registro pessoal.
 */
export async function getPersonal(id: string): Promise<Personal> {
  try {
    const response = await fetch(`/api/personal/${id}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching personal with ID ${id}:`, error);
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
      body: JSON.stringify(data),
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