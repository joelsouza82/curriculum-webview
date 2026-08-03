'use client';

import React, { useEffect, useState } from 'react';
import { getPersonals } from '../../../services/personalService';
import styles from './page.module.css';
import { Personal } from '../../../types/personal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import Header from '../../../components/Header';

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

const paths = {
  user: <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />,
  location: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </>
  ),
  phone: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />,
  email: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
  globe: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A8.959 8.959 0 013 12c0-1.605.42-3.113 1.157-4.418" />,
  link: <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />,
  code: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />,
  calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
  alert: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />,
  inbox: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 13.5V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.5M2.25 13.5l1.591-6.363A2.25 2.25 0 015.99 5.25h12.02a2.25 2.25 0 012.149 1.887l1.591 6.363" />,
};

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  if (!children) {
    return null;
  }
  return (
    <div className={styles.infoRow}>
      <Icon className={styles.infoIcon}>{icon}</Icon>
      <span>{children}</span>
    </div>
  );
}

function formatBirthdate(value: string) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('pt-BR');
}

export default function SearchPage() {
  const [personals, setPersonals] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session = useRequireAuth();
  const { goToPersonal, logout } = useAppNavigation();
  const safePersonals = Array.isArray(personals) ? personals : [];

  useEffect(() => {
    if (!session) {
      return;
    }

    const fetchPersonals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPersonals();
        setPersonals(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching personals:', err);
        setError('Falha ao carregar dados pessoais. Verifique sua conexão ou tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonals();
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <>
      <Header
        title="Currículos Encontrados"
        onBack={goToPersonal}
        onLogout={logout}
      />
      <main className={styles.main}>
        {loading && (
          <div className={styles.stateWrap}>
            <span className={styles.spinner} aria-hidden="true" />
            <p className={styles.stateText}>Carregando currículos...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.stateWrap}>
            <Icon className={`${styles.stateIcon} ${styles.stateIconError}`}>{paths.alert}</Icon>
            <p className={styles.stateText}>{error}</p>
          </div>
        )}

        {!loading && !error && safePersonals.length === 0 && (
          <div className={styles.stateWrap}>
            <Icon className={styles.stateIcon}>{paths.inbox}</Icon>
            <p className={styles.stateText}>Nenhum currículo encontrado.</p>
          </div>
        )}

        {!loading && !error && safePersonals.length > 0 && (
          <div className={styles.grid}>
            {safePersonals.map((personal) => {
              const fullAddress = [
                personal.address,
                personal.neighborhood,
                personal.city,
                personal.state,
                personal.cep,
              ]
                .filter(Boolean)
                .join(', ');

              const docLine = [
                personal.document && `CPF: ${personal.document}`,
                personal.rg && `RG: ${personal.rg}`,
              ]
                .filter(Boolean)
                .join(' • ');

              return (
                <div key={personal.id_personal} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.avatar} aria-hidden="true">
                      <Icon className={styles.avatarIcon}>{paths.user}</Icon>
                    </span>
                    <div>
                      <h2 className={styles.name}>{personal.name || 'Sem nome'}</h2>
                      {docLine && <p className={styles.subtitle}>{docLine}</p>}
                    </div>
                  </div>

                  <div className={styles.infoList}>
                    <InfoRow icon={paths.location}>{fullAddress}</InfoRow>
                    <InfoRow icon={paths.phone}>{personal.phone}</InfoRow>
                    <InfoRow icon={paths.email}>{personal.email}</InfoRow>
                    <InfoRow icon={paths.calendar}>{formatBirthdate(personal.birthdate)}</InfoRow>
                    <InfoRow icon={paths.globe}>{personal.website}</InfoRow>
                    <InfoRow icon={paths.link}>{personal.linkedin}</InfoRow>
                    <InfoRow icon={paths.code}>{personal.github}</InfoRow>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
