import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CadastroPage from './page';
import { createLogin } from '../../services/loginService';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('../../services/loginService', () => ({
  createLogin: jest.fn(),
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

  it('warns the user and does not redirect when the email is already taken', async () => {
    (createLogin as jest.Mock).mockRejectedValue(new Error('Já existe um cadastro para este e-mail.'));

    await fillAndSubmit('taken@example.com');

    expect(await screen.findByText('Já existe um cadastro para este e-mail.')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('creates the login and shows a success message for a new email', async () => {
    (createLogin as jest.Mock).mockResolvedValue({ id: 2, email: 'new@example.com', password: '123456' });

    await fillAndSubmit('new@example.com');

    await waitFor(() =>
      expect(createLogin).toHaveBeenCalledWith({ email: 'new@example.com', password: '123456' })
    );
    expect(await screen.findByText('Cadastro realizado com sucesso!')).toBeInTheDocument();
  });

  it('shows an error message when creating the login fails', async () => {
    (createLogin as jest.Mock).mockRejectedValue(new Error('Falha ao criar cadastro'));

    await fillAndSubmit('new@example.com');

    expect(await screen.findByText('Falha ao criar cadastro')).toBeInTheDocument();
  });
});
