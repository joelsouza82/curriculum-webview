import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdatePage from './page';
import { getPersonals, updatePersonal } from '../../../services/personalService';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Personal } from '../../../types/personal';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('loginId=11'),
}));

jest.mock('../../../services/personalService', () => ({
  getPersonals: jest.fn(),
  updatePersonal: jest.fn(),
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
  document: '',
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

describe('UpdatePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRequireAuth as jest.Mock).mockReturnValue({ id: 11, email: 'user@example.com' });
    (useAppNavigation as jest.Mock).mockReturnValue({ goToSearch, goToPersonal, logout });
  });

  it('shows a not-found state when there is no record for the login', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);

    render(<UpdatePage />);

    expect(
      await screen.findByText('Nenhum registro pessoal encontrado para este login.')
    ).toBeInTheDocument();
  });

  it('loads the matching record into the form with proper labels', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([basePersonal]);

    render(<UpdatePage />);

    const nameInput = await screen.findByLabelText('Nome completo');
    expect(nameInput).toHaveValue('Ana');
    expect(screen.getByLabelText('E-mail')).toHaveValue('ana@example.com');
  });

  it('submits the updated record', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([basePersonal]);
    (updatePersonal as jest.Mock).mockResolvedValue({ ...basePersonal, name: 'Ana Souza' });
    const user = userEvent.setup();

    render(<UpdatePage />);

    const nameInput = await screen.findByLabelText('Nome completo');
    await user.clear(nameInput);
    await user.type(nameInput, 'Ana Souza');
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

    await waitFor(() =>
      expect(updatePersonal).toHaveBeenCalledWith(
        '5',
        expect.objectContaining({ name: 'Ana Souza', login_id: '11' })
      )
    );
    expect(await screen.findByText('Dados atualizados com sucesso!')).toBeInTheDocument();
  });

  it('blocks submission and shows a field error when the CPF is invalid', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([basePersonal]);
    const user = userEvent.setup();

    render(<UpdatePage />);

    const documentInput = await screen.findByLabelText('CPF');
    await user.type(documentInput, '123');
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

    expect(await screen.findByText('CPF inválido.')).toBeInTheDocument();
    expect(
      screen.getByText('Corrija os campos destacados antes de continuar.')
    ).toBeInTheDocument();
    expect(updatePersonal).not.toHaveBeenCalled();
  });
});
