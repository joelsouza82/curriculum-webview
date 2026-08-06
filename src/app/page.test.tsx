import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { login } from '../services/loginService';
import { saveSession } from '../services/authService';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('../services/loginService', () => ({
  login: jest.fn(),
}));

jest.mock('../services/authService', () => ({
  saveSession: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('disables the submit button until both fields are filled', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const button = screen.getByRole('button', { name: /acessar/i });
    expect(button).toBeDisabled();

    await user.type(screen.getByLabelText('E-mail'), 'user@example.com');
    expect(button).toBeDisabled();

    await user.type(screen.getByLabelText('Senha'), '123456');
    expect(button).toBeEnabled();
  });

  it('saves the session and navigates to /home on successful login', async () => {
    const user = userEvent.setup();
    const loggedUser = { id: 9, email: 'user@example.com', password: '123456' };
    (login as jest.Mock).mockResolvedValue(loggedUser);

    render(<LoginPage />);

    await user.type(screen.getByLabelText('E-mail'), 'user@example.com');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.click(screen.getByRole('button', { name: /acessar/i }));

    await waitFor(() => expect(saveSession).toHaveBeenCalledWith(loggedUser));
    expect(login).toHaveBeenCalledWith({ email: 'user@example.com', password: '123456' });
    expect(push).toHaveBeenCalledWith('/home?loginId=9');
  });

  it('shows an error message when login fails', async () => {
    const user = userEvent.setup();
    (login as jest.Mock).mockRejectedValue(new Error('E-mail ou senha inválidos.'));

    render(<LoginPage />);

    await user.type(screen.getByLabelText('E-mail'), 'user@example.com');
    await user.type(screen.getByLabelText('Senha'), 'wrong');
    await user.click(screen.getByRole('button', { name: /acessar/i }));

    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument();
    expect(saveSession).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});
