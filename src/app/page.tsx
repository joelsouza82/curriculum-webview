'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { login } from '../services/loginService';
import { saveSession } from '../services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      saveSession(user);
      router.push('/home');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'E-mail ou senha inválidos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Acesse o sistema de currículos</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={!email || !password || loading}
          >
            {loading ? 'Acessando...' : 'Acessar'}
          </button>
        </form>
      </div>
    </main>
  );
}
