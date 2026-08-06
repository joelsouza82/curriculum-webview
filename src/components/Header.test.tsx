import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header', () => {
  it('renders the title', () => {
    render(<Header title="Minha Página" onLogout={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Minha Página' })).toBeInTheDocument();
  });

  it('does not render a back button when onBack is not provided', () => {
    render(<Header title="Minha Página" onLogout={jest.fn()} />);

    expect(screen.queryByRole('button', { name: 'Voltar' })).not.toBeInTheDocument();
  });

  it('renders and triggers the back button when onBack is provided', async () => {
    const onBack = jest.fn();
    const user = userEvent.setup();
    render(<Header title="Minha Página" onBack={onBack} onLogout={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('triggers onLogout when the logout button is clicked', async () => {
    const onLogout = jest.fn();
    const user = userEvent.setup();
    render(<Header title="Minha Página" onLogout={onLogout} />);

    await user.click(screen.getByRole('button', { name: 'Sair' }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
