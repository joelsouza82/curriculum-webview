import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CadastroPage from './page';
import { createLogin, getLogins } from '../../services/loginService';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('../../services/loginService', () => ({
  createLogin: jest.fn(),
  getLogins: jest.fn(),
}));

describe('CadastroPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function fillAndSubmit(email: string, password = '123456') {
    const user = userEvent.setup();
    render(<CadastroPage />);

    await user.type(screen.getByLabelText('E-mail'), email);
    await user.type(screen.getByLabelText('Senha'), password);
    await user.click(screen.getByRole('button', { name: /cadastrar/i }));
  }

  it('warns the user and does not create a login when the email is already taken', async () => {
    (getLogins as jest.Mock).mockResolvedValue([
      { id: 1, email: 'taken@example.com', password: 'x' },
    ]);

    await fillAndSubmit('Taken@example.com');

    expect(await screen.findByText('Já existe um cadastro para este e-mail.')).toBeInTheDocument();
    expect(createLogin).not.toHaveBeenCalled();
  });

  it('creates the login and shows a success message for a new email', async () => {
    (getLogins as jest.Mock).mockResolvedValue([]);
    (createLogin as jest.Mock).mockResolvedValue({ id: 2, email: 'new@example.com', password: '123456' });

    await fillAndSubmit('new@example.com');

    await waitFor(() =>
      expect(createLogin).toHaveBeenCalledWith({ email: 'new@example.com', password: '123456' })
    );
    expect(await screen.findByText('Cadastro realizado com sucesso!')).toBeInTheDocument();
  });

  it('shows an error message when checking existing logins fails', async () => {
    (getLogins as jest.Mock).mockRejectedValue(new Error('Falha ao buscar cadastros'));

    await fillAndSubmit('new@example.com');

    expect(await screen.findByText('Falha ao buscar cadastros')).toBeInTheDocument();
    expect(createLogin).not.toHaveBeenCalled();
  });
});
