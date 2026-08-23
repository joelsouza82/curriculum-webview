import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from './page';
import { getPersonals } from '../../../services/personalService';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Personal } from '../../../types/personal';

const mockUseSearchParams = jest.fn(() => new URLSearchParams('loginId=11'));

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
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

const goToPersonal = jest.fn();
const logout = jest.fn();

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
    mockUseSearchParams.mockReturnValue(new URLSearchParams('loginId=11'));
    (useRequireAuth as jest.Mock).mockReturnValue({ id: 11, email: 'user@example.com' });
    (useAppNavigation as jest.Mock).mockReturnValue({ goToPersonal, logout });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders nothing while there is no session', () => {
    (useRequireAuth as jest.Mock).mockReturnValue(null);
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));

    const { container } = render(<SearchPage />);

    expect(container.textContent).toBe('');
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
      { ...basePersonal, birthdate: '2000-01-31' },
      { ...basePersonal, id_personal: '6', login_id: '99', name: 'Outro Login' },
    ]);

    render(<SearchPage />);

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument();
    expect(screen.queryByText('Outro Login')).not.toBeInTheDocument();
    expect(screen.getByText('CPF: 123.456.789-00')).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByText('31/01/2000')).toBeInTheDocument();
  });

  it('formats a birthdate that does not match the ISO pattern', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([
      { ...basePersonal, birthdate: 'January 5, 2020' },
    ]);

    render(<SearchPage />);

    expect(await screen.findByText('05/01/2020')).toBeInTheDocument();
  });

  it('falls back to the raw value when the birthdate cannot be parsed', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([
      { ...basePersonal, birthdate: 'not-a-date' },
    ]);

    render(<SearchPage />);

    expect(await screen.findByText('not-a-date')).toBeInTheDocument();
  });

  it('falls back to the session id when the URL has no loginId', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    (getPersonals as jest.Mock).mockResolvedValue([basePersonal]);

    render(<SearchPage />);

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument();
  });

  it('navigates back when the header back button is clicked', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([basePersonal]);
    const user = userEvent.setup();

    render(<SearchPage />);
    await screen.findByText('Ana Souza');

    await user.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(goToPersonal).toHaveBeenCalledWith('11');
  });

  it('shows a placeholder name and hides the subtitle when name/document/rg are missing', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([
      { ...basePersonal, name: '', document: '', rg: '' },
    ]);

    render(<SearchPage />);

    expect(await screen.findByText('Sem nome')).toBeInTheDocument();
    expect(screen.queryByText(/CPF:|RG:/)).not.toBeInTheDocument();
  });

  it('shows the RG line when only the RG is present', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([
      { ...basePersonal, document: '', rg: '12.345.678-9' },
    ]);

    render(<SearchPage />);

    expect(await screen.findByText('RG: 12.345.678-9')).toBeInTheDocument();
  });
});
