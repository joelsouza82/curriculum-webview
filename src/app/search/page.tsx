'use client';

import React, { useEffect, useState } from 'react';
import { getPersonals } from '../../services/personalService';
import styles from './page.module.css'; // Estilos específicos da página de busca
import { Personal } from '../../types/personal';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import Header from '../../components/Header';

export default function SearchPage() {
  const [personals, setPersonals] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session = useRequireAuth();
  const { goToHome, logout } = useAppNavigation();
  const safePersonals = Array.isArray(personals) ? personals : [];

  useEffect(() => {
    if (!session) {
      return;
    }

    const fetchPersonals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPersonals();
        setPersonals(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching personals:', err);
        setError('Falha ao carregar dados pessoais. Verifique sua conexão ou tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonals();
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <>
      <Header
        title="Currículos Encontrados"
        onBack={goToHome}
        onLogout={logout}
      />
      <main className={styles.main}>
        {loading && <p className="text-gray-600 text-lg">Carregando currículos...</p>}
        {error && <p className="text-red-500 text-lg">{error}</p>}

        {!loading && !error && safePersonals.length === 0 && (
          <p className="text-gray-600 text-lg">Nenhum currículo encontrado.</p>
        )}

        {!loading && !error && safePersonals.length > 0 && (
          <div className={styles.grid}>
            {safePersonals.map((personal) => (
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
    </>
  );
}