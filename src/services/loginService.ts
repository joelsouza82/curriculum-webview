import { Login } from '../types/login';
import { AuthSession } from '../types/auth';
import { getAuthHeader } from './authService';

interface JwtPayload {
  sub: number;
  email: string;
  exp: number;
}

function decodeJwtPayload(token: string): JwtPayload {
  const [, payload] = token.split('.');
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return JSON.parse(atob(padded)) as JwtPayload;
}

export async function getLogins(): Promise<Login[]> {
  const response = await fetch('/api/logins', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao buscar cadastros');
  }

  const logins = await response.json();
  return Array.isArray(logins) ? logins : [];
}

/**
 * Autentica no back-end via POST /auth/login e retorna a sessão pronta
 * para uso (id e email extraídos do token JWT retornado).
 */
export async function authLogin(
  credentials: Pick<Login, 'email' | 'password'>
): Promise<AuthSession> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'E-mail ou senha inválidos.');
  }

  const { token } = await response.json();
  const payload = decodeJwtPayload(token);

  return { id: payload.sub, email: payload.email, token };
}

export async function createLogin(
  credentials: Pick<Login, 'email' | 'password'>
): Promise<Login> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao criar cadastro');
  }

  return response.json();
}
