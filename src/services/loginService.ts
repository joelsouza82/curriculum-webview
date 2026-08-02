import { Login } from '../types/login';

export async function login(
  credentials: Pick<Login, 'email' | 'password'>
): Promise<Login> {
  const response = await fetch('/api/logins', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha no login');
  }

  const logins: Login[] = await response.json();

  if (!Array.isArray(logins)) {
    throw new Error('Resposta inválida da API de login');
  }

  const match = logins.find(
    (item) =>
      item.email === credentials.email && item.password === credentials.password
  );

  if (!match) {
    throw new Error('E-mail ou senha inválidos.');
  }

  return match;
}
