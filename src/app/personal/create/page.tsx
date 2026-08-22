'use client';

import React, { useEffect, useState, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createPersonal, getPersonals } from '../../../services/personalService';
import styles from './page.module.css';
import { Personal } from '../../../types/personal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import Header from '../../../components/Header';
import { PERSONAL_FIELD_LABELS } from '../../../shared/constants';
import { maskPersonalField, validatePersonalField } from '../../../shared/validation';

type InputProps = {
  type: string;
  maxLength?: number;
  inputMode?: 'numeric' | 'tel' | 'email' | 'text';
  placeholder?: string;
};

function getFieldInputProps(field: string): InputProps {
  switch (field) {
    case 'birthdate':
      return { type: 'date' };
    case 'document':
      return { type: 'text', maxLength: 14, inputMode: 'numeric', placeholder: '000.000.000-00' };
    case 'rg':
      return { type: 'text', maxLength: 12, placeholder: '00.000.000-0' };
    case 'phone':
      return { type: 'text', maxLength: 15, inputMode: 'tel', placeholder: '(00) 00000-0000' };
    case 'email':
      return { type: 'email', placeholder: 'seuemail@exemplo.com' };
    default:
      return { type: 'text' };
  }
}

function CreateForm() {
  const session = useRequireAuth();
  const searchParams = useSearchParams();
  const { goToPersonal, goToUpdate, goBack, logout } = useAppNavigation();
  const loginId = searchParams.get('loginId') || (session ? String(session.id) : '');

  const [formData, setFormData] = useState<Omit<Personal, 'id_personal' | 'login_id'>>({
    name: '',
    rg: '',
    document: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    phone: '',
    email: '',
    website: '',
    linkedin: '',
    github: '',
    birthdate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!session || !loginId) {
      setCheckingExisting(false);
      return;
    }

    let cancelled = false;

    const checkExisting = async () => {
      try {
        setCheckingExisting(true);
        const personals = await getPersonals();
        const exists = Array.isArray(personals)
          && personals.some((item: Personal) => String(item.login_id) === loginId);
        if (!cancelled) {
          setAlreadyExists(exists);
        }
      } catch (err) {
        console.error('Falha ao verificar dados pessoais existentes:', err);
      } finally {
        if (!cancelled) {
          setCheckingExisting(false);
        }
      }
    };

    checkExisting();
    return () => {
      cancelled = true;
    };
  }, [loginId, session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maskedValue = maskPersonalField(name, value);
    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: validatePersonalField(name, maskedValue) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      return;
    }

    const newFieldErrors: Record<string, string> = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
      newFieldErrors[field] = validatePersonalField(field, formData[field] as string);
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
      await createPersonal({ ...formData, login_id: loginId });
      setSuccess('Registro criado com sucesso!');
      setTimeout(() => goToPersonal(loginId), 2000);
    } catch (err) {
      console.error('Falha ao criar registro:', err);
      setError('Não foi possível criar o registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  const fields = Object.keys(formData) as Array<keyof typeof formData>;

  return (
    <>
      <Header
        title="Cadastrar Dados Pessoais"
        onBack={goBack}
        onLogout={logout}
      />
      <main className={styles.main}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        {!checkingExisting && alreadyExists && !success && (
          <div className={styles.warning}>
            <p>Seu login já possui dados pessoais cadastrados.</p>
            <button
              type="button"
              className={styles.warningLink}
              onClick={() => goToUpdate(loginId)}
            >
              Ir para Atualização
            </button>
          </div>
        )}

        {!checkingExisting && !alreadyExists && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {fields.map((field) => (
              <div className={styles.formGroup} key={field}>
                <label htmlFor={field} className={styles.label}>
                  {PERSONAL_FIELD_LABELS[field]}
                </label>
                <input
                  {...getFieldInputProps(field)}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className={`${styles.input} ${fieldErrors[field] ? styles.inputInvalid : ''}`}
                  disabled={loading}
                  required
                  aria-invalid={!!fieldErrors[field]}
                  aria-describedby={fieldErrors[field] ? `${field}-error` : undefined}
                />
                {fieldErrors[field] && (
                  <span id={`${field}-error`} className={styles.fieldError}>
                    {fieldErrors[field]}
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
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        )}
      </main>
    </>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <CreateForm />
    </Suspense>
  );
}
