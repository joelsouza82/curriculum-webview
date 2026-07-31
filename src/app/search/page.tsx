'use client';

import React, { useEffect, useState } from 'react';
import { getPersonals } from '../../services/personalService';
import styles from './page.module.css'; // Estilos específicos da página de busca
import { useRouter } from 'next/navigation';
import { Personal } from '../../types/personal';

export default function SearchPage() {
  const [personals, setPersonals] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const handleBackToHome = () => router.push('/');

  useEffect(() => {
    const fetchPersonals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPersonals();
        setPersonals(data);
      } catch (err: any) {
        console.error("Error fetching personals:", err);
        setError("Falha ao carregar dados pessoais. Verifique sua conexão ou tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonals();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <main className={styles.main}>
      <div className="w-full mb-4">
        <button
          className={`${styles.backButton} flex items-center`}
          onClick={handleBackToHome}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Voltar para Home
        </button>
      </div>

      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Currículos Encontrados</h1>
      </div>

      {loading && <p className="text-gray-600 text-lg">Carregando currículos...</p>}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      {!loading && !error && personals.length === 0 && (
        <p className="text-gray-600 text-lg">Nenhum currículo encontrado.</p>
      )}

      {!loading && !error && personals.length > 0 && (
        <div className={styles.grid}>
          {personals.map((personal) => (
            <div key={personal.id_personal} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">{personal.address}</h2>
              <p className="text-gray-600">{personal.neighborhood}</p>
              <p className="text-gray-600">{personal.city}</p>
              <p className="text-gray-600">{personal.state}</p>
              <p className="text-gray-600">{personal.cep}</p>
              <p className="text-gray-600">{personal.phone}</p>
              <p className="text-gray-600">{personal.email}</p>
              <p className="text-gray-600">{personal.website}</p>
              <p className='text-gray-600'>{personal.linkedin}</p> 
              <p className='text-gray-600'>{personal.github}</p>           
            </div>
          ))}
        </div>
      )}

    </main>
  );
}