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

const userPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
  />
);

const identificationPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5Zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0Zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0Z"
  />
);

const mapPinPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0Z"
  />
);

const mapPinOutline = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0Z"
  />
);

const buildingPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
  />
);

const hashtagPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
  />
);

const phonePath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25Z"
  />
);

const emailPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
  />
);

const globePath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
  />
);

const linkPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
  />
);

const codeBracketPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
  />
);

const calendarPath = (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
  />
);

const mapPinFull = (
  <>
    {mapPinPath}
    {mapPinOutline}
  </>
);

const PERSONAL_FIELD_ICONS: Record<string, React.ReactNode> = {
  name: userPath,
  rg: identificationPath,
  document: identificationPath,
  address: mapPinFull,
  neighborhood: mapPinFull,
  city: buildingPath,
  state: mapPinFull,
  cep: hashtagPath,
  phone: phonePath,
  email: emailPath,
  website: globePath,
  linkedin: linkPath,
  github: codeBracketPath,
  birthdate: calendarPath,
};

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