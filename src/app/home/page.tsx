'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import Header from '../../components/Header';
import ResumeUpload from '../../components/ResumeUpload';

const icons = {
  personal: '🧑',
  experience: '💼',
  courses: '📚',
  diplomas: '🎓',
};

function HomeContent() {
  const session = useRequireAuth();
  const searchParams = useSearchParams();
  const { goToPersonal, goToImport, logout } = useAppNavigation();

  if (!session) {
    return null;
  }

  const loginId = searchParams.get('loginId') || String(session.id);

  return (
    <>
      <Header title="Gerenciador de Currículos" onLogout={logout} email={session.email} />
      <main className={styles.main}>
        <div className={styles.layout}>
          <nav className={styles.sidebar}>
            <button
              className={`${styles.button} ${styles.personalButton}`}
              onClick={() => goToPersonal(loginId)}
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
          </nav>

          <div className={styles.uploadPanel}>
            <ResumeUpload loginId={loginId} onImported={() => goToImport(loginId)} />
          </div>
        </div>
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <HomeContent />
    </Suspense>
  );
}
