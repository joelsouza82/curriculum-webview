'use client';

import React from 'react';
import styles from './page.module.css';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import Header from '../../components/Header';

const icons = {
  personal: '🧑',
  experience: '💼',
  courses: '📚',
  diplomas: '🎓',
};

export default function HomePage() {
  const session = useRequireAuth();
  const { goToPersonal, logout } = useAppNavigation();

  if (!session) {
    return null;
  }

  return (
    <>
      <Header title="Gerenciador de Currículos" onLogout={logout} />
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <p className={styles.welcome}>Olá, {session.email}</p>
        </div>

        <div className={styles.grid}>
          <button
            className={`${styles.button} ${styles.personalButton}`}
            onClick={goToPersonal}
          >
            <span className={styles.icon} aria-hidden="true">{icons.personal}</span>
            <span>Dados Pessoais</span>
          </button>
          <button className={`${styles.button} ${styles.experienceButton}`}>
            <span className={styles.icon} aria-hidden="true">{icons.experience}</span>
            <span>Experiências</span>
          </button>
          <button className={`${styles.button} ${styles.coursesButton}`}>
            <span className={styles.icon} aria-hidden="true">{icons.courses}</span>
            <span>Cursos</span>
          </button>
          <button className={`${styles.button} ${styles.diplomasButton}`}>
            <span className={styles.icon} aria-hidden="true">{icons.diplomas}</span>
            <span>Diplomas</span>
          </button>
        </div>
      </main>
    </>
  );
}
