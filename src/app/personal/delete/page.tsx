'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPersonals, deletePersonal } from '../../../services/personalService';
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

const inboxPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 13.5V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.5M2.25 13.5l1.591-6.363A2.25 2.25 0 015.99 5.25h12.02a2.25 2.25 0 012.149 1.887l1.591 6.363"
  />
);

const trashPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
  />
);

function DeleteForm() {
  const searchParams = useSearchParams();
  const session = useRequireAuth();
  const { goToSearch, goToPersonal, logout } = useAppNavigation();
  const loginId = searchParams.get('loginId') || (session ? String(session.id) : '');

  const [personal, setPersonal] = useState<Personal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    if (!loginId) {
      setError('Login não fornecido na URL.');
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
        console.error('Falha ao buscar dados pessoais:', err);
        setError('Não foi possível carregar os dados para exclusão. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalData();
  }, [loginId, session]);

  const handleDelete = async () => {
    if (!personal) {
      return;
    }

    setDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await deletePersonal(personal.id_personal);
      setSuccess('Registro excluído com sucesso!');
      setPersonal(null);
      setTimeout(() => goToPersonal(loginId), 2000);
    } catch (err) {
      console.error('Falha ao excluir dados:', err);
      setError('Não foi possível excluir os dados. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <Header
        title="Excluir Dados Pessoais"
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
          <div className={styles.card}>
            <p className={styles.warning}>
              Tem certeza que deseja excluir permanentemente o registro abaixo? Esta ação não pode ser desfeita.
            </p>

            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Nome:</span>
                <span>{personal.name || '—'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Documento:</span>
                <span>{personal.document || '—'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email:</span>
                <span>{personal.email || '—'}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => goToSearch(loginId)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={handleDelete}
                disabled={deleting}
              >
                <Icon className={styles.buttonIcon}>{trashPath}</Icon>
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function DeletePage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <DeleteForm />
    </Suspense>
  );
}
