import { AuthSession } from '../types/auth';
import { Login } from '../types/login';

const SESSION_KEY = 'auth_session';

export function saveSession(login: Login): void {
  const session: AuthSession = {
    id: login.id,
    email: login.email,
  };
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

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
