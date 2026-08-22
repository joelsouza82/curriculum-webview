import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePage from './page';
import { createPersonal, getPersonals } from '../../../services/personalService';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Personal } from '../../../types/personal';
import { PERSONAL_FIELD_LABELS } from '../../../shared/constants';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('loginId=11'),
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

describe('CreatePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRequireAuth as jest.Mock).mockReturnValue({ id: 11, email: 'user@example.com' });
    (useAppNavigation as jest.Mock).mockReturnValue({ goToPersonal, goToUpdate, goBack, logout });
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

    const specialValues: Record<string, string> = {
      birthdate: '2000-01-31',
      email: 'email-value@example.com',
      document: '11144477735',
      rg: '123456789',
      phone: '11987654321',
    };

    for (const [field, label] of Object.entries(PERSONAL_FIELD_LABELS)) {
      const value = specialValues[field] ?? `${field}-value`;
      await user.type(screen.getByLabelText(label), value);
    }

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

  it('blocks submission and shows a field error when the CPF is invalid', async () => {
    (getPersonals as jest.Mock).mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreatePage />);
    await screen.findByLabelText('Nome completo');

    const specialValues: Record<string, string> = {
      birthdate: '2000-01-31',
      email: 'email-value@example.com',
      document: '123',
      rg: '123456789',
      phone: '11987654321',
    };

    for (const [field, label] of Object.entries(PERSONAL_FIELD_LABELS)) {
      const value = specialValues[field] ?? `${field}-value`;
      await user.type(screen.getByLabelText(label), value);
    }

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText('CPF inválido.')).toBeInTheDocument();
    expect(
      screen.getByText('Corrija os campos destacados antes de continuar.')
    ).toBeInTheDocument();
    expect(createPersonal).not.toHaveBeenCalled();
  });
});
