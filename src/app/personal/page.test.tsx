import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalPage from './page';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAppNavigation } from '../../hooks/useAppNavigation';

const mockUseSearchParams = jest.fn(() => new URLSearchParams('loginId=11'));

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock('../../hooks/useRequireAuth', () => ({
  useRequireAuth: jest.fn(),
}));

const goToSearch = jest.fn();
const goToUpdate = jest.fn();
const goToCreate = jest.fn();
const goToDelete = jest.fn();
const goToHome = jest.fn();
const logout = jest.fn();

jest.mock('../../hooks/useAppNavigation', () => ({
  useAppNavigation: jest.fn(),
}));

describe('PersonalPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams('loginId=11'));
    (useRequireAuth as jest.Mock).mockReturnValue({ id: 11, email: 'user@example.com' });
    (useAppNavigation as jest.Mock).mockReturnValue({
      goToSearch,
      goToUpdate,
      goToCreate,
      goToDelete,
      goToHome,
      logout,
    });
  });

  it('renders nothing while there is no session', () => {
    (useRequireAuth as jest.Mock).mockReturnValue(null);

    const { container } = render(<PersonalPage />);

    expect(container.textContent).not.toMatch(/Olá/);
  });

  it('falls back to the session id and navigates back when the URL has no loginId', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    const user = userEvent.setup();

    render(<PersonalPage />);

    await user.click(await screen.findByRole('button', { name: 'Voltar' }));

    expect(goToHome).toHaveBeenCalledWith('11');
  });

  it('navigates to create when "Adicionar" is clicked', async () => {
    const user = userEvent.setup();
    render(<PersonalPage />);

    await user.click(screen.getByRole('button', { name: /adicionar/i }));

    expect(goToCreate).toHaveBeenCalledWith('11');
  });

  it('navigates to update when "Atualizar" is clicked', async () => {
    const user = userEvent.setup();
    render(<PersonalPage />);

    await user.click(screen.getByRole('button', { name: /atualizar/i }));

    expect(goToUpdate).toHaveBeenCalledWith('11');
  });

  it('navigates to search when "Buscar" is clicked', async () => {
    const user = userEvent.setup();
    render(<PersonalPage />);

    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(goToSearch).toHaveBeenCalledWith('11');
  });

  it('navigates to delete when "Excluir" is clicked', async () => {
    const user = userEvent.setup();
    render(<PersonalPage />);

    await user.click(screen.getByRole('button', { name: /excluir/i }));

    expect(goToDelete).toHaveBeenCalledWith('11');
  });
});
