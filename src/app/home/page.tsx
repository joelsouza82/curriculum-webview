'use client';

import React from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { clearSession } from '../../services/authService';
import { useRequireAuth } from '../../hooks/useRequireAuth';

const icons = {
  add: '＋',
  update: '✎',
  search: '⌕',
  delete: '⌫',
};

export default function HomePage() {
  const router = useRouter();
  const session = useRequireAuth();

  const handleLogout = () => {
    clearSession();
    router.replace('/');
  };

  if (!session) {
    return null;
  }

  const handleSearchClick = () => {
    router.push('/search');
  };

  const handleUpdateClick = () => {
    router.push('/update?id=5');
  };

  return (
    <main className={styles.main}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Gerenciador de Currículos</h1>
        <p className={styles.welcome}>Olá, {session.email}</p>
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </div>

      <div className={styles.grid}>
        <button className={`${styles.button} ${styles.addButton}`}>
          <span className={styles.icon} aria-hidden="true">{icons.add}</span>
          <span>Adicionar</span>
        </button>
        <button
          className={`${styles.button} ${styles.updateButton}`}
          onClick={handleUpdateClick}
        >
          <span className={styles.icon} aria-hidden="true">{icons.update}</span>
          <span>Atualizar</span>
        </button>
        <button
          className={`${styles.button} ${styles.searchButton}`}
          onClick={handleSearchClick}
        >
          <span className={styles.icon} aria-hidden="true">{icons.search}</span>
          <span>Buscar</span>
        </button>
        <button className={`${styles.button} ${styles.deleteButton}`}>
          <span className={styles.icon} aria-hidden="true">{icons.delete}</span>
          <span>Excluir</span>
        </button>
      </div>
    </main>
  );
}
