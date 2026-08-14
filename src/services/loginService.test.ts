import { getLogins, authLogin, createLogin } from './loginService';
import { Login } from '../types/login';
import { saveSession, clearSession } from './authService';

function mockFetchOnce(response: { ok?: boolean; status?: number; jsonBody?: unknown }) {
  const { jsonBody, ok = true, status = 200 } = response;
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: jest.fn().mockResolvedValue(jsonBody),
  });
}

/**
 * Monta um JWT (sem assinatura válida) só para os testes de decodificação
 * do payload feita por authLogin.
 */
function fakeJwt(payload: Record<string, unknown>): string {
  const base64url = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}.signature`;
}

describe('loginService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    sessionStorage.clear();
  });

  describe('getLogins', () => {
    it('fetches /api/logins and returns the array', async () => {
      const logins: Login[] = [{ id: 1, email: 'a@a.com', password: '123' }];
      mockFetchOnce({ jsonBody: logins });

      const result = await getLogins();

      expect(global.fetch).toHaveBeenCalledWith('/api/logins', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(logins);
    });

    it('sends the Authorization header when a session exists', async () => {
      saveSession({ id: 9, email: 'a@a.com', token: 'tok123' });
      mockFetchOnce({ jsonBody: [] });

      await getLogins();

      expect(global.fetch).toHaveBeenCalledWith('/api/logins', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer tok123' },
      });
      clearSession();
    });

    it('returns an empty array when the response is not an array', async () => {
      mockFetchOnce({ jsonBody: { oops: true } });

      const result = await getLogins();

      expect(result).toEqual([]);
    });

    it('throws when the response is not ok', async () => {
      mockFetchOnce({ ok: false, status: 500, jsonBody: { message: 'server error' } });

      await expect(getLogins()).rejects.toThrow('server error');
    });
  });

  describe('authLogin', () => {
    it('posts credentials to /api/auth/login and returns the decoded session', async () => {
      const token = fakeJwt({ email: 'b@b.com', sub: 2, exp: 9999999999 });
      mockFetchOnce({ jsonBody: { token } });

      const result = await authLogin({ email: 'b@b.com', password: '456' });

      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'b@b.com', password: '456' }),
      });
      expect(result).toEqual({ id: 2, email: 'b@b.com', token });
    });

    it('throws with the API error message when credentials are invalid', async () => {
      mockFetchOnce({ ok: false, status: 401, jsonBody: { error: 'credenciais inválidas' } });

      await expect(authLogin({ email: 'b@b.com', password: 'wrong' })).rejects.toThrow(
        'credenciais inválidas'
      );
    });

    it('falls back to a default message when the API sends no error body', async () => {
      mockFetchOnce({ ok: false, status: 500, jsonBody: {} });

      await expect(authLogin({ email: 'a@a.com', password: '123' })).rejects.toThrow(
        'E-mail ou senha inválidos.'
      );
    });
  });

  describe('createLogin', () => {
    it('posts credentials to /api/login', async () => {
      const created: Login = { id: 3, email: 'c@c.com', password: '789' };
      mockFetchOnce({ jsonBody: created });

      const result = await createLogin({ email: 'c@c.com', password: '789' });

      expect(global.fetch).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'c@c.com', password: '789' }),
      });
      expect(result).toEqual(created);
    });

    it('throws when the response is not ok', async () => {
      mockFetchOnce({ ok: false, status: 400, jsonBody: { message: 'invalid' } });

      await expect(createLogin({ email: 'x@x.com', password: '1' })).rejects.toThrow('invalid');
    });
  });
});
