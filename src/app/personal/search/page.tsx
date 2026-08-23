'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPersonals } from '../../../services/personalService';
import styles from './page.module.css';
import { Personal } from '../../../types/personal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import Header from '../../../components/Header';
import {
  Icon,
  avatarPath,
  mapPinFull,
  phonePath,
  emailPath,
  globePath,
  linkPath,
  codeBracketPath,
  calendarPath,
  alertPath,
  inboxPath,
} from '../../../shared/icons';

const paths = {
  user: avatarPath,
  location: mapPinFull,
  phone: phonePath,
  email: emailPath,
  globe: globePath,
  link: linkPath,
  code: codeBracketPath,
  calendar: calendarPath,
  alert: alertPath,
  inbox: inboxPath,
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
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('pt-BR');
}

function SearchContent() {
  const [personals, setPersonals] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session = useRequireAuth();
  const searchParams = useSearchParams();
  const { goToPersonal, logout } = useAppNavigation();
  const loginId = searchParams.get('loginId') || (session ? String(session.id) : '');
  const safePersonals = Array.isArray(personals)
    ? personals.filter((item) => String(item.login_id) === loginId)
    : [];

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
        title="Dados Pessoais Encontrado"
        onBack={() => goToPersonal(loginId)}
        onLogout={logout}
      />
      <main className={styles.main}>
        {loading && (
          <div className={styles.stateWrap}>
            <span className={styles.spinner} aria-hidden="true" />
            <p className={styles.stateText}>Carregando dados pessoais...</p>
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
            <p className={styles.stateText}>Nenhum dado pessoal encontrado para este login.</p>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <SearchContent />
    </Suspense>
  );
}
