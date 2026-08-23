'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { authLogin } from '../services/loginService';
import { saveSession } from '../services/authService';
import { Icon, emailPath, lockPath, arrowRightPath, checkPath } from '../shared/icons';

const HERO_FEATURES = [
  'Cadastre e centralize seus dados pessoais e profissionais em um só lugar.',
  'Envie seu currículo para empresas e recrutadores de forma rápida e prática através de nosso aplicativo.',
  'Atualize suas informações a qualquer momento, com segurança e praticidade.',
];

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
      const session = await authLogin({ email, password });
      saveSession(session);
      router.push(`/home?loginId=${session.id}`);
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
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Portal de Currículos</span>
          <h1 className={styles.heroTitle}>
            Seu currículo, sempre atualizado e em um só lugar.
          </h1>
          <p className={styles.heroText}>
            Centralize seus dados pessoais e profissionais, mantenha tudo validado
            e acesse quando precisar apresentar seu currículo de forma moderna.
          </p>
          <ul className={styles.heroList}>
            {HERO_FEATURES.map((feature) => (
              <li key={feature} className={styles.heroListItem}>
                <Icon className={styles.heroListIcon}>{checkPath}</Icon>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className={styles.formSide}>
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
                'Acessando...'
              ) : (
                <>
                  Acessar
                  <Icon className={styles.buttonIcon}>{arrowRightPath}</Icon>
                </>
              )}
            </button>
          </form>

          <p className={styles.footerText}>
            Não tem conta?{' '}
            <button
              type="button"
              className={styles.link}
              onClick={() => router.push('/login')}
            >
              Crie aqui.
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
