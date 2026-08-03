'use client';

import React, { useState, FormEvent, Suspense } from 'react';
import { createPersonal } from '../../../services/personalService';
import styles from './page.module.css';
import { Personal } from '../../../types/personal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import Header from '../../../components/Header';

function CreateForm() {
  const session = useRequireAuth();
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
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createPersonal(formData);
      setSuccess('Registro criado com sucesso!');
      setTimeout(goToPersonal, 2000);
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
        title="Criar Novo Currículo"
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
                d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 5.23 11.08 5 12 5c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62m0 0H4.41c-.9-.89-1.41-2.05-1.41-3.12 0-2.61 2.05-4.73 4.6-4.73 0-.72.37-1.35.97-1.73C7.48 3.55 9.63 2 12 2c3.59 0 6.18 2.66 6.35 6.04z"
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
