'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPersonals, deletePersonal } from '../../../services/personalService';
import styles from './page.module.css';
import { Personal } from '../../../types/personal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import Header from '../../../components/Header';
import { Icon, inboxPath, trashPath, xMarkPath } from '../../../shared/icons';

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
        email={session.email}
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
                <Icon className={styles.buttonIcon}>{xMarkPath}</Icon>
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
