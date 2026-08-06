import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './page';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAppNavigation } from '../../hooks/useAppNavigation';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('loginId=11'),
}));

jest.mock('../../hooks/useRequireAuth', () => ({
  useRequireAuth: jest.fn(),
}));

const goToPersonal = jest.fn();
const logout = jest.fn();

jest.mock('../../hooks/useAppNavigation', () => ({
  useAppNavigation: jest.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppNavigation as jest.Mock).mockReturnValue({ goToPersonal, logout });
  });

  it('renders nothing while there is no session', () => {
    (useRequireAuth as jest.Mock).mockReturnValue(null);

    const { container } = render(<HomePage />);

    expect(container.textContent).not.toMatch(/Olá/);
  });

  it('greets the authenticated user and navigates to personal data', async () => {
    (useRequireAuth as jest.Mock).mockReturnValue({ id: 11, email: 'user@example.com' });
    const user = userEvent.setup();

    render(<HomePage />);

    expect(await screen.findByText('Olá, user@example.com')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /dados pessoais/i }));

    expect(goToPersonal).toHaveBeenCalledWith('11');
  });
});
