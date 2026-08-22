'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { createLogin } from '../../services/loginService';

function Icon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const emailPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
  />
);

const lockPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
  />
);

const userPlusPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
  />
);

export default function CadastroPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await createLogin({ email, password });
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => router.push('/'), 2000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Não foi possível concluir o cadastro.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>Cadastre-se para acessar o sistema de currículos</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              E-mail
            </label>
            <div className={styles.inputWrapper}>
              <Icon className={styles.inputIcon}>{emailPath}</Icon>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <div className={styles.inputWrapper}>
              <Icon className={styles.inputIcon}>{lockPath}</Icon>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={!email || !password || loading}
          >
            {loading ? (
              'Cadastrando...'
            ) : (
              <>
                Cadastrar
                <Icon className={styles.buttonIcon}>{userPlusPath}</Icon>
              </>
            )}
          </button>
        </form>

        <p className={styles.footerText}>
          <button
            type="button"
            className={styles.link}
            onClick={() => router.push('/')}
          >
            Já tenho conta, voltar ao login
          </button>
        </p>
      </div>
    </main>
  );
}
