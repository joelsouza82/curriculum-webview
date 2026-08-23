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
import { maskPersonalField, validatePersonalField } from '../../../shared/validation';
import { getFieldInputProps } from '../../../shared/fieldInput';
import { Icon, inboxPath, PERSONAL_FIELD_ICONS } from '../../../shared/icons';

function toDateInputValue(value: string) {
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
}

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      const maskedValue = maskPersonalField(name, value);
      setPersonal({ ...personal, [name]: maskedValue });
      setFieldErrors((prev) => ({ ...prev, [name]: validatePersonalField(name, maskedValue) }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!personal || !session) {
      setError("Dados pessoais não carregados.");
      return;
    }

    const newFieldErrors: Record<string, string> = {};
    Object.keys(personal)
      .filter((key) => key !== 'id_personal' && key !== 'login_id')
      .forEach((key) => {
        newFieldErrors[key] = validatePersonalField(key, personal[key as keyof Personal] || '');
      });
    setFieldErrors(newFieldErrors);
    if (Object.values(newFieldErrors).some(Boolean)) {
      setError('Corrija os campos destacados antes de continuar.');
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
                <div className={styles.inputWrapper}>
                  {key !== 'birthdate' && (
                    <Icon className={styles.inputIcon}>{PERSONAL_FIELD_ICONS[key]}</Icon>
                  )}
                  <input
                    {...getFieldInputProps(key)}
                    id={key}
                    name={key}
                    value={
                      key === 'birthdate'
                        ? toDateInputValue((personal as any)[key] || '')
                        : (personal as any)[key] || ''
                    }
                    onChange={handleInputChange}
                    className={`${styles.input} ${key === 'birthdate' ? styles.inputNoIcon : ''} ${fieldErrors[key] ? styles.inputInvalid : ''}`}
                    disabled={loading}
                    aria-invalid={!!fieldErrors[key]}
                    aria-describedby={fieldErrors[key] ? `${key}-error` : undefined}
                  />
                </div>
                {fieldErrors[key] && (
                  <span id={`${key}-error`} className={styles.fieldError}>
                    {fieldErrors[key]}
                  </span>
                )}
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