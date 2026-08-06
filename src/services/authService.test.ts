import { saveSession, getSession, isAuthenticated, clearSession } from './authService';
import { Login } from '../types/login';

describe('authService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const login: Login = { id: 5, email: 'user@example.com', password: 'secret' };

  it('saveSession stores only id and email under auth_session', () => {
    saveSession(login);

    const raw = sessionStorage.getItem('auth_session');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toEqual({ id: 5, email: 'user@example.com' });
  });

  it('getSession returns null when nothing is stored', () => {
    expect(getSession()).toBeNull();
  });

  it('getSession returns the saved session', () => {
    saveSession(login);

    expect(getSession()).toEqual({ id: 5, email: 'user@example.com' });
  });

  it('getSession clears and returns null for corrupted data', () => {
    sessionStorage.setItem('auth_session', 'not-json');

    expect(getSession()).toBeNull();
    expect(sessionStorage.getItem('auth_session')).toBeNull();
  });

  it('isAuthenticated reflects whether a session exists', () => {
    expect(isAuthenticated()).toBe(false);

    saveSession(login);

    expect(isAuthenticated()).toBe(true);
  });

  it('clearSession removes the stored session', () => {
    saveSession(login);

    clearSession();

    expect(getSession()).toBeNull();
  });
});
