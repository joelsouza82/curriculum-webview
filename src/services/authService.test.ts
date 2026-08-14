import {
  saveSession,
  getSession,
  getToken,
  getAuthHeader,
  isAuthenticated,
  clearSession,
} from './authService';
import { AuthSession } from '../types/auth';

describe('authService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const session: AuthSession = { id: 5, email: 'user@example.com', token: 'abc.def.ghi' };

  it('saveSession stores the session under auth_session', () => {
    saveSession(session);

    const raw = sessionStorage.getItem('auth_session');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toEqual(session);
  });

  it('getSession returns null when nothing is stored', () => {
    expect(getSession()).toBeNull();
  });

  it('getSession returns the saved session', () => {
    saveSession(session);

    expect(getSession()).toEqual(session);
  });

  it('getSession clears and returns null for corrupted data', () => {
    sessionStorage.setItem('auth_session', 'not-json');

    expect(getSession()).toBeNull();
    expect(sessionStorage.getItem('auth_session')).toBeNull();
  });

  it('getToken returns null when there is no session', () => {
    expect(getToken()).toBeNull();
  });

  it('getToken returns the stored token', () => {
    saveSession(session);

    expect(getToken()).toBe('abc.def.ghi');
  });

  it('getAuthHeader returns an empty object without a session', () => {
    expect(getAuthHeader()).toEqual({});
  });

  it('getAuthHeader returns a Bearer header when a session exists', () => {
    saveSession(session);

    expect(getAuthHeader()).toEqual({ Authorization: 'Bearer abc.def.ghi' });
  });

  it('isAuthenticated reflects whether a session exists', () => {
    expect(isAuthenticated()).toBe(false);

    saveSession(session);

    expect(isAuthenticated()).toBe(true);
  });

  it('clearSession removes the stored session', () => {
    saveSession(session);

    clearSession();

    expect(getSession()).toBeNull();
  });
});
