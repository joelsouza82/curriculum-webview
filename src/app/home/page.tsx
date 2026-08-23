'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import Header from '../../components/Header';
import ResumeUpload from '../../components/ResumeUpload';
import { Icon, identificationPath, documentArrowUpPath } from '../../shared/icons';

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
        <div className={styles.welcome}>
          <h2 className={styles.welcomeTitle}>Bem-vindo(a) ao Gerenciador de Currículos!</h2>
          <p className={styles.welcomeText}>
            Escolha como preencher os seus dados:
          </p>
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeItem}>
              <Icon className={styles.welcomeItemIcon}>{identificationPath}</Icon>
              <div>
                <span className={styles.welcomeItemBadge}>Opção 1</span>
                <h3 className={styles.welcomeItemTitle}>Preencha manualmente</h3>
                <p className={styles.welcomeItemText}>
                  Use o menu ao lado e comece por <strong>Dados Pessoais</strong> para inserir
                  suas informações.
                </p>
              </div>
            </div>

            <div className={styles.welcomeItem}>
              <Icon className={styles.welcomeItemIcon}>{documentArrowUpPath}</Icon>
              <div>
                <span className={styles.welcomeItemBadge}>Opção 2</span>
                <h3 className={styles.welcomeItemTitle}>Importe seu currículo</h3>
                <p className={styles.welcomeItemText}>
                  Envie um arquivo em <strong>PDF ou Word</strong> ao lado e deixe os dados
                  pré-preenchidos para você só revisar e salvar.
                </p>
              </div>
            </div>
          </div>
        </div>
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
