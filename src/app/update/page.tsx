'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPersonal, updatePersonal } from '../../services/personalService';
import styles from './page.module.css';

export default function UpdatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personalId = searchParams.get('id');

  const [personal, setPersonal] = useState<Personal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!personalId) {
      setError("ID do registro não fornecido na URL.");
      setLoading(false);
      return;
    }

    const fetchPersonalData = async () => {
      try {
        setLoading(true);
        const data = await getPersonal(personalId);
        setPersonal(data);
        setError(null);
      } catch (err) {
        console.error("Falha ao buscar dados pessoais:", err);
        setError("Não foi possível carregar os dados para atualização. Verifique o ID e tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalData();
  }, [personalId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (personal) {
      const { name, value } = e.target;
      setPersonal({ ...personal, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!personal || !personalId) {
      setError("Dados pessoais não carregados.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Assumindo que existe uma função updatePersonal(id, data) no seu serviço
      await updatePersonal(personalId, personal);
      setSuccess("Dados atualizados com sucesso!");
      setTimeout(() => router.push('/search'), 2000); // Redireciona para a busca após 2s
    } catch (err) {
      console.error("Falha ao atualizar dados:", err);
      setError("Não foi possível atualizar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <main className={styles.main}>
      <div className="w-full mb-4">
        <button className={`${styles.backButton} flex items-center`} onClick={handleBack}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Voltar
        </button>
      </div>
      <h1 className={styles.title}>Atualizar Dados Pessoais</h1>

      {loading && <p>Carregando dados do currículo...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {!loading && personal && (
        <form onSubmit={handleSubmit} className={styles.form}>
          {Object.keys(personal).filter(key => key !== 'id_personal').map((key) => (
            <div className={styles.formGroup} key={key}>
              <label htmlFor={key} className={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
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
            {loading ? 'Atualizando...' : 'Salvar Alterações'}
          </button>
        </form>
      )}
    </main>
  );
}