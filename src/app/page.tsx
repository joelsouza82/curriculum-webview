'use client';

import React from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/search');
  };

  return (
    <main className={styles.main}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Gerenciador de Currículos</h1>
      </div>

      <div className={styles.grid}>
        <button className={`${styles.button} ${styles.addButton}`}>
          Adicionar Currículo
        </button>
        <button className={`${styles.button} ${styles.updateButton}`}>
          Atualizar Currículo
        </button>
        <button
          className={`${styles.button} ${styles.searchButton}`}
          onClick={handleSearchClick}
        >
          Buscar Currículo
        </button>
        <button className={`${styles.button} ${styles.deleteButton}`}>
          Excluir Currículo
        </button>
      </div>
    </main>
  );
}
