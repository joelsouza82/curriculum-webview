'use client';

import React, { useEffect, useState, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPersonals, updatePersonal } from '../../../services/personalService';
import styles from './page.module.css';
import { Personal } from '../../../types/personal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import Header from '../../../components/Header';
import { PERSONAL_FIELD_LABELS } from '../../../shared/constants';

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

const inboxPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 13.5V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.5M2.25 13.5l1.591-6.363A2.25 2.25 0 015.99 5.25h12.02a2.25 2.25 0 012.149 1.887l1.591 6.363"
  />
);

function UpdateForm() {
  const searchParams = useSearchParams();
  const session = useRequireAuth();
  const { goToSearch, goToPersonal, logout } = useAppNavigation();
  const loginId = searchParams.get('loginId') || (session ? String(session.id) : '');

  const [personal, setPersonal] = useState<Personal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    if (!loginId) {
      setError("Login não fornecido na URL.");
      setLoading(false);
      return;
    }

    const fetchPersonalData = async () => {
      try {
        setLoading(true);
        const personals = await getPersonals();
        const match = personals.find((item: Personal) => String(item.login_id) === loginId);
        if (!match) {
          setNotFound(true);
          setPersonal(null);
          return;
        }
        setNotFound(false);
        setPersonal(match);
        setError(null);
      } catch (err) {
        console.error("Falha ao buscar dados pessoais:", err);
        setError("Não foi possível carregar os dados para atualização. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalData();
  }, [loginId, session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (personal) {
      const { name, value } = e.target;
      setPersonal({ ...personal, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!personal || !session) {
      setError("Dados pessoais não carregados.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updatePersonal(personal.id_personal, { ...personal, login_id: loginId });
      setSuccess("Dados atualizados com sucesso!");
      setTimeout(() => goToSearch(loginId), 2000); // Redireciona para a busca após 2s
    } catch (err) {
      console.error("Falha ao atualizar dados:", err);
      setError("Não foi possível atualizar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <Header
        title="Atualizar Dados Pessoais"
        onBack={() => goToPersonal(loginId)}
        onLogout={logout}
      />
      <main className={styles.main}>
        {loading && <p>Carregando dados pessoais...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        {!loading && !error && notFound && (
          <div className={styles.stateWrap}>
            <Icon className={styles.stateIcon}>{inboxPath}</Icon>
            <p className={styles.stateText}>Nenhum registro pessoal encontrado para este login.</p>
          </div>
        )}

        {!loading && personal && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {Object.keys(personal).filter(key => key !== 'id_personal' && key !== 'login_id').map((key) => (
              <div className={styles.formGroup} key={key}>
                <label htmlFor={key} className={styles.label}>
                  {PERSONAL_FIELD_LABELS[key as keyof typeof PERSONAL_FIELD_LABELS]}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={(personal as any)[key] || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            ))}
            <button type="submit" className={styles.button} disabled={loading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={styles.buttonIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              {loading ? 'Atualizando...' : 'Salvar Alterações'}
            </button>
          </form>
        )}
      </main>
    </>
  );
}

export default function UpdatePage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <UpdateForm />
    </Suspense>
  );
}