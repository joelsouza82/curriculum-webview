import { Login } from '../types/login';

export async function login(
  credentials: Pick<Login, 'email' | 'password'>
): Promise<any> {
  const params = new URLSearchParams(credentials as Record<string, string>);
  const response = await fetch(`/api/login?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha no login');
  }

  return response.json();
}