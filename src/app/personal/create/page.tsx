'use client';

import React, { useState, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createPersonal } from '../../../services/personalService';
import styles from './page.module.css';
import { Personal } from '../../../types/personal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import Header from '../../../components/Header';

function CreateForm() {
  const session = useRequireAuth();
  const searchParams = useSearchParams();
  const { goToPersonal, goBack, logout } = useAppNavigation();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const loginId = searchParams.get('loginId') || String(session.id);

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

        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map((field) => (
            <div className={styles.formGroup} key={field}>
              <label htmlFor={field} className={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'birthdate' ? 'date' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className={styles.input}
                disabled={loading}
                required
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
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
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
