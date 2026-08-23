'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { createLogin } from '../../services/loginService';
import { Icon, emailPath, lockPath, userPlusPath } from '../../shared/icons';

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
