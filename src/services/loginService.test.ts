import { getLogins, login, createLogin } from './loginService';
import { Login } from '../types/login';

function mockFetchOnce(response: { ok?: boolean; status?: number; jsonBody?: unknown }) {
  const { jsonBody, ok = true, status = 200 } = response;
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: jest.fn().mockResolvedValue(jsonBody),
  });
}

describe('loginService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
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

  describe('login', () => {
    const logins: Login[] = [
      { id: 1, email: 'a@a.com', password: '123' },
      { id: 2, email: 'b@b.com', password: '456' },
    ];

    it('returns the matching login for correct credentials', async () => {
      mockFetchOnce({ jsonBody: logins });

      const result = await login({ email: 'b@b.com', password: '456' });

      expect(result).toEqual(logins[1]);
    });

    it('throws when no login matches the credentials', async () => {
      mockFetchOnce({ jsonBody: logins });

      await expect(login({ email: 'b@b.com', password: 'wrong' })).rejects.toThrow(
        'E-mail ou senha inválidos.'
      );
    });

    it('throws when the response is not ok', async () => {
      mockFetchOnce({ ok: false, status: 500, jsonBody: { message: 'down' } });

      await expect(login({ email: 'a@a.com', password: '123' })).rejects.toThrow('down');
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
