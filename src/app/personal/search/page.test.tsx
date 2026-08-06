import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchPage from './page';
import { getPersonals } from '../../../services/personalService';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Personal } from '../../../types/personal';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('loginId=11'),
}));

jest.mock('../../../services/personalService', () => ({
  getPersonals: jest.fn(),
}));

jest.mock('../../../hooks/useRequireAuth', () => ({
  useRequireAuth: jest.fn(),
}));

jest.mock('../../../hooks/useAppNavigation', () => ({
  useAppNavigation: jest.fn(),
}));

const basePersonal: Personal = {
  id_personal: '5',
  login_id: '11',
  name: 'Ana Souza',
  rg: '',
  document: '123.456.789-00',
  address: 'Rua A',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  cep: '00000-000',
  phone: '11999999999',
  email: 'ana@example.com',
  website: '',
  linkedin: '',
  github: '',
  birthdate: '',
};

describe('SearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (useRequireAuth as jest.Mock).mockReturnValue({ id: 11, email: 'user@example.com' });
    (useAppNavigation as jest.Mock).mockReturnValue({ goToPersonal: jest.fn(), logout: jest.fn() });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows an empty state when there are no records for the login', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);

    render(<SearchPage />);

    expect(
      await screen.findByText('Nenhum dado pessoal encontrado para este login.')
    ).toBeInTheDocument();
  });

  it('shows an error state when fetching fails', async () => {
    (getPersonals as jest.Mock).mockRejectedValue(new Error('network error'));

    render(<SearchPage />);

    expect(
      await screen.findByText(
        'Falha ao carregar dados pessoais. Verifique sua conexão ou tente novamente mais tarde.'
      )
    ).toBeInTheDocument();
  });

  it('renders a card for each matching personal record', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([
      basePersonal,
      { ...basePersonal, id_personal: '6', login_id: '99', name: 'Outro Login' },
    ]);

    render(<SearchPage />);

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument();
    expect(screen.queryByText('Outro Login')).not.toBeInTheDocument();
    expect(screen.getByText('CPF: 123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
  });
});
