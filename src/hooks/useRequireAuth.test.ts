import { renderHook, waitFor } from '@testing-library/react';
import { useRequireAuth } from './useRequireAuth';
import { getSession } from '../services/authService';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

jest.mock('../services/authService', () => ({
  getSession: jest.fn(),
}));

describe('useRequireAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to / and returns null when there is no session', async () => {
    (getSession as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useRequireAuth());

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(result.current).toBeNull();
  });

  it('returns the current session without redirecting when authenticated', async () => {
    const session = { id: 1, email: 'user@example.com' };
    (getSession as jest.Mock).mockReturnValue(session);

    const { result } = renderHook(() => useRequireAuth());

    await waitFor(() => expect(result.current).toEqual(session));
    expect(replace).not.toHaveBeenCalled();
  });
});
