import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePage from './page';
import { createPersonal, getPersonals } from '../../../services/personalService';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Personal } from '../../../types/personal';
import { PERSONAL_FIELD_LABELS } from '../../../shared/constants';

const mockUseSearchParams = jest.fn(() => new URLSearchParams('loginId=11'));

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock('../../../services/personalService', () => ({
  createPersonal: jest.fn(),
  getPersonals: jest.fn(),
}));

jest.mock('../../../hooks/useRequireAuth', () => ({
  useRequireAuth: jest.fn(),
}));

const goToPersonal = jest.fn();
const goToUpdate = jest.fn();
const goBack = jest.fn();
const logout = jest.fn();

jest.mock('../../../hooks/useAppNavigation', () => ({
  useAppNavigation: jest.fn(),
}));

const VALID_VALUES: Record<string, string> = {
  birthdate: '2000-01-31',
  email: 'email-value@example.com',
  document: '11144477735',
  rg: '123456789',
  phone: '11987654321',
  cep: '01310100',
};

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Record<string, string> = {}
) {
  const values = { ...VALID_VALUES, ...overrides };
  for (const [field, label] of Object.entries(PERSONAL_FIELD_LABELS)) {
    const value = values[field] ?? `${field}-value`;
    await user.type(screen.getByLabelText(label), value);
  }
}

describe('CreatePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockUseSearchParams.mockReturnValue(new URLSearchParams('loginId=11'));
    (useRequireAuth as jest.Mock).mockReturnValue({ id: 11, email: 'user@example.com' });
    (useAppNavigation as jest.Mock).mockReturnValue({ goToPersonal, goToUpdate, goBack, logout });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders nothing while there is no session', () => {
    (useRequireAuth as jest.Mock).mockReturnValue(null);
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));

    const { container } = render(<CreatePage />);

    expect(container.textContent).toBe('');
  });

  it('skips the existing-record check when the URL has no loginId and there is no session id to fall back to', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    (useRequireAuth as jest.Mock).mockReturnValue({ id: '', email: 'user@example.com' });

    render(<CreatePage />);

    expect(await screen.findByLabelText('Nome completo')).toBeInTheDocument();
    expect(getPersonals).not.toHaveBeenCalled();
  });

  it('falls back to the session id when the URL has no loginId', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    (getPersonals as jest.Mock).mockResolvedValue([
      { id_personal: '1', login_id: '11' } as Personal,
    ]);

    render(<CreatePage />);

    expect(
      await screen.findByText('Seu login já possui dados pessoais cadastrados.')
    ).toBeInTheDocument();
  });

  it('logs and continues when checking for an existing record fails', async () => {
    (getPersonals as jest.Mock).mockRejectedValue(new Error('network error'));

    render(<CreatePage />);

    expect(await screen.findByLabelText('Nome completo')).toBeInTheDocument();
  });

  it('shows a warning and hides the form when a personal record already exists', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([
      { id_personal: '1', login_id: '11' } as Personal,
    ]);
    const user = userEvent.setup();

    render(<CreatePage />);

    expect(
      await screen.findByText('Seu login já possui dados pessoais cadastrados.')
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Nome completo')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /ir para atualização/i }));
    expect(goToUpdate).toHaveBeenCalledWith('11');
  });

  it('renders the form with proper labels when there is no existing record', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);

    render(<CreatePage />);

    expect(await screen.findByLabelText('Nome completo')).toBeInTheDocument();
    expect(screen.getByLabelText('CPF')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
  });

  it('submits the form data with the current loginId', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);
    (createPersonal as jest.Mock).mockResolvedValue({ id_personal: '1' });
    const user = userEvent.setup();

    render(<CreatePage />);
    await screen.findByLabelText('Nome completo');
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() =>
      expect(createPersonal).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'name-value',
          email: 'email-value@example.com',
          login_id: '11',
        })
      )
    );
    expect(await screen.findByText('Registro criado com sucesso!')).toBeInTheDocument();
  });

  it('shows a saving indicator while the create request is in flight', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);
    let resolveCreate: (value: Personal) => void = () => {};
    (createPersonal as jest.Mock).mockReturnValue(
      new Promise<Personal>((resolve) => {
        resolveCreate = resolve;
      })
    );
    const user = userEvent.setup();

    render(<CreatePage />);
    await screen.findByLabelText('Nome completo');
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByRole('button', { name: /salvando/i })).toBeDisabled();

    resolveCreate({ id_personal: '1' } as Personal);
    await waitFor(() => expect(createPersonal).toHaveBeenCalled());
  });

  it('shows an error message when creating the record fails', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);
    (createPersonal as jest.Mock).mockRejectedValue(new Error('server error'));
    const user = userEvent.setup();

    render(<CreatePage />);
    await screen.findByLabelText('Nome completo');
    await fillForm(user);

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(
      await screen.findByText('Não foi possível criar o registro. Tente novamente.')
    ).toBeInTheDocument();
  });

  it('blocks submission and shows a field error when the CPF is invalid', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreatePage />);
    await screen.findByLabelText('Nome completo');
    await fillForm(user, { document: '123' });

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('CPF inválido.')).toBeInTheDocument();
    expect(
      screen.getByText('Corrija os campos destacados antes de continuar.')
    ).toBeInTheDocument();
    expect(createPersonal).not.toHaveBeenCalled();
  });
});
