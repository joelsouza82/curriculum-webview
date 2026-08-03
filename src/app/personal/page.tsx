'use client';

import React from 'react';
import styles from './page.module.css';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import Header from '../../components/Header';

const icons = {
  add: '＋',
  update: '✎',
  search: '⌕',
  delete: '⌫',
};

export default function PersonalPage() {
  const session = useRequireAuth();
  const { goToSearch, goToUpdate, goToCreate, goToHome, logout } = useAppNavigation();

  if (!session) {
    return null;
  }

  return (
    <>
      <Header title="Dados Pessoais" onBack={goToHome} onLogout={logout} />
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <p className={styles.welcome}>Olá, {session.email}</p>
        </div>

        <div className={styles.grid}>
          <button
            className={`${styles.button} ${styles.addButton}`}
            onClick={goToCreate}
          >
            <span className={styles.icon} aria-hidden="true">{icons.add}</span>
            <span>Adicionar</span>
          </button>
          <button
            className={`${styles.button} ${styles.updateButton}`}
            onClick={() => goToUpdate('5')}
          >
            <span className={styles.icon} aria-hidden="true">{icons.update}</span>
            <span>Atualizar</span>
          </button>
          <button
            className={`${styles.button} ${styles.searchButton}`}
            onClick={goToSearch}
          >
            <span className={`${styles.icon} ${styles.searchIcon}`} aria-hidden="true">{icons.search}</span>
            <span>Buscar</span>
          </button>
          <button className={`${styles.button} ${styles.deleteButton}`}>
            <span className={styles.icon} aria-hidden="true">{icons.delete}</span>
            <span>Excluir</span>
          </button>
        </div>
      </main>
    </>
  );
}
