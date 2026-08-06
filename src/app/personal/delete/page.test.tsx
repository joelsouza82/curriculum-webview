import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeletePage from './page';
import { getPersonals, deletePersonal } from '../../../services/personalService';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Personal } from '../../../types/personal';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('loginId=11'),
}));

jest.mock('../../../services/personalService', () => ({
  getPersonals: jest.fn(),
  deletePersonal: jest.fn(),
}));

jest.mock('../../../hooks/useRequireAuth', () => ({
  useRequireAuth: jest.fn(),
}));

const goToSearch = jest.fn();
const goToPersonal = jest.fn();
const logout = jest.fn();

jest.mock('../../../hooks/useAppNavigation', () => ({
  useAppNavigation: jest.fn(),
}));

const basePersonal: Personal = {
  id_personal: '5',
  login_id: '11',
  name: 'Ana',
  rg: '',
  document: '123.456.789-00',
  address: '',
  neighborhood: '',
  city: '',
  state: '',
  cep: '',
  phone: '',
  email: 'ana@example.com',
  website: '',
  linkedin: '',
  github: '',
  birthdate: '',
};

describe('DeletePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRequireAuth as jest.Mock).mockReturnValue({ id: 11, email: 'user@example.com' });
    (useAppNavigation as jest.Mock).mockReturnValue({ goToSearch, goToPersonal, logout });
  });

  it('shows a not-found state when there is no record for the login', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);

    render(<DeletePage />);

    expect(
      await screen.findByText('Nenhum registro pessoal encontrado para este login.')
    ).toBeInTheDocument();
  });

  it('shows the record summary for confirmation', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([basePersonal]);

    render(<DeletePage />);

    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
  });

  it('deletes the record and redirects on confirm', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([basePersonal]);
    (deletePersonal as jest.Mock).mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<DeletePage />);

    await user.click(await screen.findByRole('button', { name: /^excluir$/i }));

    await waitFor(() => expect(deletePersonal).toHaveBeenCalledWith('5'));
    expect(await screen.findByText('Registro excluído com sucesso!')).toBeInTheDocument();
  });

  it('navigates to search when cancel is clicked', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([basePersonal]);
    const user = userEvent.setup();

    render(<DeletePage />);

    await user.click(await screen.findByRole('button', { name: /cancelar/i }));

    expect(goToSearch).toHaveBeenCalledWith('11');
    expect(deletePersonal).not.toHaveBeenCalled();
  });
});
