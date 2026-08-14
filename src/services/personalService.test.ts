import { getPersonals, createPersonal, updatePersonal, deletePersonal } from './personalService';
import { Personal } from '../types/personal';
import { saveSession, clearSession } from './authService';

function mockFetchOnce(response: Partial<Response> & { jsonBody?: unknown; textBody?: string }) {
  const { jsonBody, textBody, ok = true, status = 200 } = response;
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: jest.fn().mockResolvedValue(jsonBody),
    text: jest.fn().mockResolvedValue(textBody ?? ''),
  });
}

describe('personalService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPersonals', () => {
    it('fetches /api/personals and returns the array', async () => {
      const personals = [{ id_personal: '1' }] as Personal[];
      mockFetchOnce({ jsonBody: personals });

      const result = await getPersonals();

      expect(global.fetch).toHaveBeenCalledWith('/api/personals', {
        cache: 'no-store',
        headers: {},
      });
      expect(result).toEqual(personals);
    });

    it('sends the Authorization header when a session exists', async () => {
      saveSession({ id: 1, email: 'a@a.com', token: 'tok123' });
      mockFetchOnce({ jsonBody: [] });

      await getPersonals();

      expect(global.fetch).toHaveBeenCalledWith('/api/personals', {
        cache: 'no-store',
        headers: { Authorization: 'Bearer tok123' },
      });
      clearSession();
    });

    it('returns an empty array when the API response is not an array', async () => {
      mockFetchOnce({ jsonBody: { not: 'an array' } });

      const result = await getPersonals();

      expect(result).toEqual([]);
    });

    it('throws when the response is not ok', async () => {
      mockFetchOnce({ ok: false, status: 500, textBody: 'boom' });

      await expect(getPersonals()).rejects.toThrow(/status: 500/);
    });
  });

  describe('createPersonal', () => {
    it('posts to /api/personal converting birthdate and login_id', async () => {
      const created = { id_personal: '1' } as Personal;
      mockFetchOnce({ jsonBody: created });

      const result = await createPersonal({
        name: 'Ana',
        rg: '',
        document: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        cep: '',
        phone: '',
        email: '',
        website: '',
        linkedin: '',
        github: '',
        birthdate: '2000-01-31',
        login_id: '42',
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Ana',
          rg: '',
          document: '',
          address: '',
          neighborhood: '',
          city: '',
          state: '',
          cep: '',
          phone: '',
          email: '',
          website: '',
          linkedin: '',
          github: '',
          birthdate: '2000-01-31T00:00:00Z',
          login_id: 42,
        }),
      });
      expect(result).toEqual(created);
    });

    it('leaves a non-YYYY-MM-DD birthdate untouched', async () => {
      mockFetchOnce({ jsonBody: {} });

      await createPersonal({
        name: '', rg: '', document: '', address: '', neighborhood: '', city: '',
        state: '', cep: '', phone: '', email: '', website: '', linkedin: '', github: '',
        birthdate: '2000-01-31T00:00:00Z',
        login_id: '1',
      });

      const call = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.birthdate).toBe('2000-01-31T00:00:00Z');
    });

    it('throws when the response is not ok', async () => {
      mockFetchOnce({ ok: false, status: 400, textBody: 'bad request' });

      await expect(
        createPersonal({
          name: '', rg: '', document: '', address: '', neighborhood: '', city: '',
          state: '', cep: '', phone: '', email: '', website: '', linkedin: '', github: '',
          birthdate: '', login_id: '1',
        })
      ).rejects.toThrow(/status: 400/);
    });
  });

  describe('updatePersonal', () => {
    it('sends a PUT to /api/personal/:id with converted fields', async () => {
      const updated = { id_personal: '7' } as Personal;
      mockFetchOnce({ jsonBody: updated });

      const result = await updatePersonal('7', { name: 'Bia', birthdate: '1999-05-10', login_id: '3' });

      expect(global.fetch).toHaveBeenCalledWith('/api/personal/7', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Bia', birthdate: '1999-05-10T00:00:00Z', login_id: 3 }),
      });
      expect(result).toEqual(updated);
    });

    it('leaves login_id undefined when not provided', async () => {
      mockFetchOnce({ jsonBody: {} });

      await updatePersonal('7', { name: 'Bia' });

      const call = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.login_id).toBeUndefined();
    });

    it('throws when the response is not ok', async () => {
      mockFetchOnce({ ok: false, status: 404, textBody: 'not found' });

      await expect(updatePersonal('7', {})).rejects.toThrow(/status: 404/);
    });
  });

  describe('deletePersonal', () => {
    it('sends a DELETE to /api/personal/:id', async () => {
      mockFetchOnce({ ok: true, jsonBody: {} });

      await deletePersonal('9');

      expect(global.fetch).toHaveBeenCalledWith('/api/personal/9', {
        method: 'DELETE',
        headers: {},
      });
    });

    it('sends the Authorization header when a session exists', async () => {
      saveSession({ id: 1, email: 'a@a.com', token: 'tok123' });
      mockFetchOnce({ ok: true, jsonBody: {} });

      await deletePersonal('9');

      expect(global.fetch).toHaveBeenCalledWith('/api/personal/9', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer tok123' },
      });
      clearSession();
    });

    it('throws when the response is not ok', async () => {
      mockFetchOnce({ ok: false, status: 500, textBody: 'boom' });

      await expect(deletePersonal('9')).rejects.toThrow(/status: 500/);
    });
  });
});
