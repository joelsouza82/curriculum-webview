import { AuthSession } from '../types/auth';

const SESSION_KEY = 'auth_session';

export function saveSession(session: AuthSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Cabeçalho Authorization para chamadas autenticadas. Retorna objeto vazio
 * quando não há sessão, para não quebrar chamadas feitas antes do login.
 */
export function getAuthHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
